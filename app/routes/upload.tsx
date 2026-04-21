import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);
        setStatusText('Uploading resume file...');

        try {
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) throw new Error('Failed to upload resume file');

            setStatusText('Analyzing resume and preparing preview...');

            const imageUploadPromise = (async () => {
                const imageFile = await convertPdfToImage(file);
                if(!imageFile.file) throw new Error('Failed to convert PDF to image');

                const uploadedImage = await fs.upload([imageFile.file]);
                if(!uploadedImage) throw new Error('Failed to upload image preview');

                return uploadedImage.path;
            })();

            const imagePath = await imageUploadPromise;

            const feedback = await ai.feedback(
                imagePath,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback) throw new Error('Failed to analyze resume - no feedback received');

            const feedbackText = typeof feedback.message?.content === 'string'
                ? feedback.message.content
                : Array.isArray(feedback.message?.content) && feedback.message.content[0]?.text
                ? feedback.message.content[0].text
                : null;

            if (!feedbackText) {
                console.error('Unexpected feedback format:', feedback);
                throw new Error('Failed to parse AI response - invalid format');
            }

            const cleanedFeedbackText = feedbackText
                .trim()
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '');

            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath,
                companyName,
                jobTitle,
                jobDescription,
                feedback: JSON.parse(cleanedFeedbackText),
            };

            setStatusText('Saving analysis...');
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            navigate(`/resume/${uuid}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong during analysis';
            console.error('[Upload] Full error:', error);
            console.error('[Upload] Error stack:', error instanceof Error ? error.stack : 'N/A');
            console.error('[Upload] Error type:', typeof error, Object.prototype.toString.call(error));
            setStatusText(`Error: ${message}`);
            setIsProcessing(false);
            setFile(null);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2 className="text-blue-600 font-semibold animate-pulse">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full mt-4" />
                        </>
                    ) : (
                        <>
                            <h2>Drop your resume for an ATS score and improvement tips</h2>
                            {file && <p className="text-sm text-gray-600 mt-2">File selected: {file.name}</p>}
                            {statusText && statusText.startsWith('Error:') && (
                                <p className="text-sm text-red-600 mt-2">{statusText}</p>
                            )}
                        </>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader selectedFile={file} onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
