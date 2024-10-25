// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAd69N8VERMqaeLIm9uzo0_ShLtHEraICw",
    authDomain: "software-design-6df8b.firebaseapp.com",
    projectId: "software-design-6df8b",
    storageBucket: "software-design-6df8b.appspot.com",
    messagingSenderId: "493377947827",
    appId: "1:493377947827:web:51d4ca3f48a36f66cf08c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// DOM Elements
const userImage = document.getElementById('userImage');
const clothingImage = document.getElementById('clothingImage');
const container = document.querySelector('.container');
const containerHeight = 500;
const containerWidth = 300;

// Load user image from local storage
window.onload = () => {
    const userImageData = localStorage.getItem('userImage');
    if (userImageData) {
        userImage.src = userImageData;
        resizeUserImage();
    }
};

// Dragging functionality
let isDragging = false;
let offsetX, offsetY;

clothingImage.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - clothingImage.getBoundingClientRect().left;
    offsetY = e.clientY - clothingImage.getBoundingClientRect().top;
    document.body.style.userSelect = "none"; // Prevent text selection
    e.preventDefault();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = "auto"; // Re-enable text selection
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let clothingX = e.clientX - container.getBoundingClientRect().left - offsetX;
        let clothingY = e.clientY - container.getBoundingClientRect().top - offsetY;

        // Constrain the clothing image within the container
        clothingX = Math.max(0, Math.min(clothingX, containerWidth - clothingImage.offsetWidth));
        clothingY = Math.max(0, Math.min(clothingY, containerHeight - clothingImage.offsetHeight));

        // Apply the new position
        clothingImage.style.transform = `translate(${clothingX}px, ${clothingY}px)`;
    }
});

// Function to upload clothing image
async function uploadClothingImage() {
    const clothingFile = document.getElementById('clothingUpload').files[0];

    if (!clothingFile || !['image/png', 'image/jpeg'].includes(clothingFile.type)) {
        alert('Please upload a valid PNG or JPEG image for clothing.');
        return;
    }

    const clothingReader = new FileReader();
    clothingReader.onload = async (event) => {
        clothingImage.src = event.target.result; // Set clothing image

        const apiKey = 'HBzT8esCnrCctLiS4YuxfLTZ';   //HBzT8esCnrCctLiS4YuxfLTZ - guarin ... emG3uH22a7D3BGBbwAPht3qg - mot ... mike api here ... hans api here ... vFw5rFNQVkgqjJbrK8PH1N99(mj ubos na)
        const formData = new FormData();
        formData.append('image_file', clothingFile);
        formData.append('size', 'auto');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: { 'X-Api-Key': apiKey },
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                clothingImage.src = URL.createObjectURL(blob); // Set image with removed background
            } else {
                console.error('Error removing background:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    clothingReader.readAsDataURL(clothingFile);
}

// Function to load sample clothing images
function loadSampleClothingImages() {
    const clothingImagesRef = ref(storage, 'Mga damit/');
    const sampleClothingContainer = document.getElementById('sampleClothingContainer');

    listAll(clothingImagesRef).then((result) => {
        result.items.forEach((imageRef) => {
            getDownloadURL(imageRef).then((url) => {
                const imgElement = document.createElement('img');
                imgElement.src = url;
                imgElement.classList.add('sample');
                imgElement.onclick = () => useSampleClothing(url);
                sampleClothingContainer.appendChild(imgElement);
            }).catch(console.error);
        });
    }).catch(console.error);
}

// Load sample clothing images when the page loads
document.addEventListener('DOMContentLoaded', loadSampleClothingImages);

// Function to use a sample clothing image
function useSampleClothing(imagePath) {
    clothingImage.src = imagePath; // Set the sample clothing image
}

// Resize user image to fit in the container
function resizeUserImage() {
    const userImageRect = userImage.getBoundingClientRect();
    const scaleFactor = Math.min(containerWidth / userImageRect.width, containerHeight / userImageRect.height);

    userImage.style.width = `${userImageRect.width * scaleFactor}px`;
    userImage.style.height = `${userImageRect.height * scaleFactor}px`;
    userImage.style.transform = `translate(${(containerWidth - userImageRect.width * scaleFactor) / 2}px, ${(containerHeight - userImageRect.height * scaleFactor) / 2}px)`;
}

// Resize clothing image based on user height and selected size
function resizeClothing() {
    const userHeight = parseFloat(document.getElementById('userHeight').value);
    const clothingSize = document.getElementById('clothingSize').value;

    if (!userHeight) {
        alert('Please enter your height.');
        return;
    }

    const sizes = {
        small: { length: 66, width: 46 },
        medium: { length: 70, width: 50 },
        large: { length: 74, width: 54 },
    };

    const { length: clothingLength } = sizes[clothingSize];
    const scaleFactor = clothingLength / userHeight;

    clothingImage.style.height = `${containerHeight * scaleFactor}px`;
    clothingImage.style.width = 'auto'; // Maintain aspect ratio
}

// Resize clothing image after it is loaded
clothingImage.onload = resizeClothing;

// Attach the overlay button's functionality
document.querySelector('button').addEventListener('click', uploadClothingImage);
