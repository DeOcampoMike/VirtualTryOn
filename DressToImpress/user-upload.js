// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase configuration
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

// Function to upload user images
function uploadImages() {
    const userFile = document.getElementById('userUpload').files[0];

    if (userFile) {
        if (!['image/png', 'image/jpeg'].includes(userFile.type)) {
            alert('Please upload a PNG or JPEG image.');
            return;
        }

        const userReader = new FileReader();
        userReader.onload = (event) => {
            localStorage.setItem('userImage', event.target.result);
            window.location.href = 'clothing-upload.html';
        };

        userReader.onerror = (error) => console.error('Error reading file:', error);
        userReader.readAsDataURL(userFile);
    } else {
        alert('Please select an image file.');
    }
}

// Attach event listener to the button
document.getElementById('uploadButton').addEventListener('click', uploadImages);

// Function to use a sample image
function useSampleImage(imagePath) {
    const sampleImage = new Image();
    sampleImage.src = imagePath;

    sampleImage.onload = () => {
        localStorage.setItem('userImage', sampleImage.src);
        window.location.href = 'clothing-upload.html';
    };
}

// Function to load sample images from Firebase Storage
function loadSampleImages() {
    const sampleImagesRef = ref(storage, 'User sample/');
    const container = document.getElementById('sampleImagesContainer');

    listAll(sampleImagesRef).then((result) => {
        result.items.forEach((imageRef) => {
            getDownloadURL(imageRef).then((url) => {
                const imgElement = document.createElement('img');
                imgElement.src = url;
                imgElement.classList.add('sample');
                imgElement.onclick = () => useSampleImage(url);
                container.appendChild(imgElement);
            }).catch(console.error);
        });
    }).catch(console.error);
}

// Load sample images on page load
document.addEventListener('DOMContentLoaded', loadSampleImages);
