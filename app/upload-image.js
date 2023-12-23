'use client'

import axios from 'axios';
import {useRef, useState} from "react";
import html2canvas from "html2canvas";
import cadre from "../public/cadre.png";
import { useMediaQuery } from 'react-responsive';

const ImageUploader = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const inputRef = useRef(null);

    const [filename, setFilename] = useState(null);

    const handleClick = () => {
        inputRef.current.click();
    };


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file)); // Ajoutez cette ligne pour stocker l'image sélectionnée dans l'état

        const formData = new FormData();
        formData.append('image', file);


        try {
            const response = await axios.post('http://localhost:9000/api/v1/upload', formData);
            console.log('Image uploadée:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
        }


    };


    const handleDownload = (event) => {
        const file = event.target.files[0];
        fetch(`http://localhost:9000/api/v1/download?image=${file}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec du téléchargement de l\'image');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(error => {
                console.error('Erreur lors du téléchargement de l\'image:', error);
            });
    };

    const downloadImage = async (blobUrl) => {
        const response = await fetch(blobUrl);
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'fichier_inconnu';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();
    };


    const screenshot = () => {


        let element = document.getElementById("imageId");

        // Appliquer les styles CSS
        element.style.position = "absolute";
        element.style.left = "135px";
        element.style.width = "560px";

        // Remplacez "buttonId" par l'ID de votre bouton
        let button = document.getElementById("buttonId");
        button.style.display = "none";

        let buttonTwo = document.getElementById("buttonIdTwo");
        buttonTwo.style.display = "none";

        html2canvas(document.getElementById("downloadImage")).then(canvas => {
            //const image = canvas.toDataURL("image/png");

            // Spécifier la largeur et la hauteur du canvas
            let width = 2318; // Largeur souhaitée
            let height = 2000; // Hauteur souhaitée

            //let width = 1080; // Largeur souhaitée
            //let height = 930; // Hauteur souhaitée

            // Créer un nouveau canvas avec la largeur et la hauteur souhaitées
            let newCanvas = document.createElement('canvas');
            newCanvas.width = width;
            newCanvas.height = height;

            // Dessiner l'ancien canvas sur le nouveau canvas
            let ctx = newCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, width, height);

            // Créer l'image à partir du nouveau canvas
            const image = newCanvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'screenshot.png';
            link.click();

            element.style.left = "390px";
            element.style.width = "360px";

        })
    }


    const isMobile = useMediaQuery({ maxWidth: 767 }); // Vous pouvez ajuster cette valeur en fonction de vos besoins

    const imgPlace = {
        height: 167,
        width: 117,
        top: 285,
        left: 31,
        display: isMobile ? 'block' : 'none', // Affiche seulement sur les téléphones portables
    };


    return (
        <div id="downloadImage" className="h-full w-full relative">

            <img src={cadre.src} loading="lazy" alt="cadre image" style={{ objectFit: 'contain', width: '100%', height: '100vh' }}/>

            <div id="buttonId" className="bg-green-200 text-center text-gray-400 inline p-3 rounded mb-10 absolute top-[750px] left-[670px]">
                {/*
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                */}
                {/* Affichez le bouton personnalisé */}
                <button
                    onClick={ () => {
                        handleClick()
                    }}
                >
                    Choisir une image
                </button>

                {/* Cachez l'élément d'entrée de fichier en utilisant des styles CSS */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={inputRef}
                    style={{ display: 'none' }}
                />
            </div>


            {/*
                <button onClick={() => downloadImage(selectedImage)} disabled={!selectedImage} className="mt-10 mb-10 bg-green-200 text-center text-gray-400 inline p-3 rounded">
                    Télécharger l'image
                </button>
            */}

            <button id="buttonIdTwo" onClick={() => screenshot()} disabled={!selectedImage} className="mb-10 bg-green-200 text-center text-gray-400 inline p-3 rounded absolute top-[750px] left-[390px]">
                Extraire la photo avec le cadre
            </button>

            <div id="imageId" className="h-[500px] w-[360px] p-3 bg-gradient-to-r from-white to-green-400 border-dashed border-white rounded-lg absolute top-[212px] left-[390px]">
                <div className="w-full h-full bg-white border-3 border-green-300 rounded-lg">
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            loading="lazy"
                            alt="une photo"
                            className="w-full h-full rounded-lg object-cover"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;

/*
element.style {
    height: 165px;
    width: 100px;
    top: 300px;
}

 */
