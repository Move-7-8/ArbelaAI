import React, { useState, useEffect } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const PdfReader = ({ pdfUrl, selectedDocuments }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [documents, setDocuments] = useState([]);

    // console.log(`SELECTED DOCUMENTS IN PDFREADER IS:${selectedDocuments} `)
    let arrayOfObjects
    try {
        arrayOfObjects = JSON.parse(selectedDocuments);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
  
    // Styles extracted from the StockCard component
    const titleStyles = {
        fontSize: '1.275rem', // Equivalent to text-lg in tailwind
        fontWeight: '600', // Equivalent to font-semibold in tailwind
        color: '#1F2937', // Equivalent to text-gray-900 in tailwind
    };

    // If a document is selected, display the PDF viewer
    if (selectedDoc) {
        return (
            // <div style={{ height: '75vh', width: '100%', position: 'relative' }}>
            <div className='h-full w-full'>
                <IconButton 
                    onClick={() => setSelectedDoc(null)} 
                    style={{ 
                        position: 'absolute', 
                        top: 10, 
                        left: 10, 
                        backgroundColor: 'transparent',
                        color: 'red',
                        zIndex: 2 
                    }}
                    aria-label="close pdf">
                    <CloseIcon />
                </IconButton>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                    <Viewer 
                        fileUrl={pdfUrl} 
                        defaultScale={SpecialZoomLevel.PageFit}
                        style={{ 
                            height: '80%',
                            width: '100%'
                        }} 
                    />
                </Worker>
            </div>
        );
    }

    // console.log('Type of selectedDocuments:', typeof selectedDocuments);
    // console.log('Is Array:', Array.isArray(selectedDocuments));

    // If no document is selected, display the list of documents
    return (
        <div class="h-full w-full flex flex-col items-center">
            <h3 style={titleStyles}>Your model</h3>
            <List component="nav">


                {selectedDocuments.map((doc, index) => (
                    <ListItemButton 
                        key={index} 
                        onClick={() => setSelectedDoc(doc.pdfLink)} // Assuming you want to use the pdfLink property
                        style={{ 
                            border: '1px solid grey', // Adjust the color as needed
                            borderRadius: '4px', // Optional: for rounded corners
                            marginBottom: '5px', // Optional: for spacing between items
                        }}
                    >
                        <ListItemText primary={doc.name} />
                    </ListItemButton>
                ))}
            </List>

            {/* Embedding the Lottie player centered in the div */}
        <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
    }}>
        <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>
        <dotlottie-player 
            src="https://lottie.host/bad49e7f-525c-4d0b-a52f-f1f1ffaafddc/2BVvBT7fQ3.json" 
            background="transparent" 
            speed="1" 
            style={{ width: '300px', height: '300px' }} 
            loop 
            autoplay>
        </dotlottie-player>
    </div>
        </div>
    );
};

export default PdfReader;
