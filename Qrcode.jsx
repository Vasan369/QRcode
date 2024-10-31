import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Input } from "@material-tailwind/react";
import { FiDownload, FiEdit } from "react-icons/fi";

export default function Qrcode() {
    const [img, setImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrdata, setQrdata] = useState("");
    const [qrsize, setQrsize] = useState("150");
    const [generated, setGenerated] = useState(false);

    async function generateqr() {
        setLoading(true);
        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrsize}x${qrsize}&data=${encodeURIComponent(qrdata)}`;
            setImg(url);
            setGenerated(true); // Mark as generated
        } catch (error) {
            alert("Error generating QR code ", error);
        } finally {
            setLoading(false);
        }
    }

    function downloadqr() {
        fetch(img)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "qrcode.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    function edit() {
        setGenerated(false); // Allow re-entry of data
    }

    return (
        <div className="flex flex-col ">
            <h1 className="text-2xl mb-2">QR CODE GENERATOR</h1>
            {loading && <p>Please wait...</p>}
            {img ? <img src={img} className="my-4 p-1 shadow-lg mx-auto w-[100px] h-[100px]" alt="QR Code" /> : <img src={assets.QR_code} className="my-4 mx-auto w-[100px] h-[100px]" alt="QR Code" />}
            {!generated && (
                <form onSubmit={generateqr} className="w-full gap-10 flex flex-col">

                    <Input
                        label="URL (or) data"
                        size="lg"
                        type="text"
                        value={qrdata}
                        required
                        onChange={(e) => setQrdata(e.target.value)}

                    />

                    <Input
                        label="Size"
                        size="lg"
                        type="text"
                        value={qrsize}
                        required
                        onChange={(e) => setQrsize(e.target.value)}

                    />
                    <button
                        type="submit"
                        className={`w-full p-3 mb-2 text-white rounded-full transition-colors ${loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={loading}

                    >
                        Generate QR Code
                    </button>
                </form>
            )}
            {generated && (
                <div className="w-full flex flex-col gap-5">
                    <button
                        className="w-full flex gap-3 justify-center items-center p-3 text-white bg-gray-500 rounded-full hover:bg-gray-700"
                        onClick={edit}
                    >
                        <FiEdit />Edit QR Code
                    </button>
                    <button
                        className="w-full flex gap-3 p-3 mb-2 text-white bg-blue-500 justify-center items-center rounded-full hover:bg-blue-700"
                        onClick={downloadqr}
                    >
                        Download<FiDownload />
                    </button>

                </div>
            )}

        </div>
    );
}
