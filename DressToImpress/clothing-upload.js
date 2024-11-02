const userImage = document.getElementById('userImage');
const clothingImage = document.getElementById('clothingImage');
const container = document.querySelector('.container');
const containerHeight = 500; // Fixed height of the box
const containerWidth = 300; // Fixed width of the box

// Initial position for clothing image
let clothingX = 0;
let clothingY = 0;

// Add event listeners for dragging
let isDragging = false;

clothingImage.addEventListener('mousedown', (e) => {
    isDragging = true;
    clothingImage.style.pointerEvents = 'auto'; // Enable pointer events for dragging
    offsetX = e.clientX - clothingImage.getBoundingClientRect().left;
    offsetY = e.clientY - clothingImage.getBoundingClientRect().top;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        clothingX = e.clientX - container.getBoundingClientRect().left - offsetX;
        clothingY = e.clientY - container.getBoundingClientRect().top - offsetY;

        // Constrain the clothing image within the container
        if (clothingX < 0) clothingX = 0;
        if (clothingY < 0) clothingY = 0;
        if (clothingX + clothingImage.offsetWidth > containerWidth) {
            clothingX = containerWidth - clothingImage.offsetWidth;
        }
        if (clothingY + clothingImage.offsetHeight > containerHeight) {
            clothingY = containerHeight - clothingImage.offsetHeight;
        }

        clothingImage.style.transform = `translate(${clothingX}px, ${clothingY}px)`;
    }
});

// Load user image from local storage
window.onload = function() {
    const userImageData = localStorage.getItem('userImage');
    if (userImageData) {
        document.getElementById('userImage').src = userImageData; // Set user image
        resizeUserImage(); // Call resize function after setting the image
    }
};

function uploadClothingImage() {
    const clothingFile = document.getElementById('clothingUpload').files[0];

    if (!clothingFile || (clothingFile.type !== 'image/png' && clothingFile.type !== 'image/jpeg')) {
        alert('Please upload a valid PNG or JPEG image for clothing.');
        return;
    }

    const clothingReader = new FileReader();
    clothingReader.onload = async function(event) {
        clothingImage.src = event.target.result; // Set clothing image

        // Background removal logic (similar to your previous code)
        const apiKey = '';//'vFw5rFNQVkgqjJbrK8PH1N99';  //HBzT8esCnrCctLiS4YuxfLTZ - guarin ... emG3uH22a7D3BGBbwAPht3qg - mot ... mike api here ... hans api here
        const formData = new FormData();
        formData.append('image_file', clothingFile);
        formData.append('size', 'auto');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': apiKey,
                },
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                clothingImage.src = URL.createObjectURL(blob); // Set the image with removed background
            } else {
                console.error('Error removing background:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    clothingReader.readAsDataURL(clothingFile);
}

function useSampleClothing(imagePath) {
    // Create a new image object
    const sampleClothingImage = new Image();
    sampleClothingImage.src = imagePath;
    clothingImage.style.display = 'block'; // Show clothing image
    document.getElementById('noImageMessage').style.display = 'none'; // Hide no image message

    sampleClothingImage.onload = function() {
        clothingImage.src = sampleClothingImage.src; // Set the sample clothing image

        // Optional: If you want to apply background removal on sample images
        // You can add the background removal logic here as needed
    };
}



// Resize user image after it is loaded
userImage.onload = function() {
    resizeUserImage(); // Resize the user image to fit in the container
    resizeClothing(); // Resize clothing after user image is resized
};

// Function to resize user image to fit in the container
function resizeUserImage() {
    const userImageRect = userImage.getBoundingClientRect();
    
    const maxWidth = containerWidth;   // Container width
    const maxHeight = containerHeight;  // Container height

    const scaleX = maxWidth / userImageRect.width;
    const scaleY = maxHeight / userImageRect.height;
    const scaleFactor = Math.min(scaleX, scaleY); // Use the smaller scaling factor to maintain aspect ratio

    userImage.style.width = `${userImageRect.width * scaleFactor}px`;
    userImage.style.height = `${userImageRect.height * scaleFactor}px`;

    const centerX = (maxWidth - userImageRect.width * scaleFactor) / 2;
    const centerY = (maxHeight - userImageRect.height * scaleFactor) / 2;

    userImage.style.transform = `translate(${centerX}px, ${centerY}px)`; 
}

// Function to resize clothing based on user height and selected size
function resizeClothing() {
    const userHeight = parseFloat(document.getElementById('userHeight').value);
    const clothingSize = document.getElementById('clothingSize').value;

    if (!userHeight) {
        alert('Please enter your height.');
        return;
    }

    const userHeightCm = userHeight;

    let clothingLength, clothingWidth;

    switch (clothingSize.toLowerCase()) { // Convert the input to lowercase for consistency
        case 'xxs':
            clothingLength = 66; // Length for XXS in cm
            clothingWidth = 81; // Chest width for XXS in cm
            break;
        case 'xs':
            clothingLength = 69; // Length for XS in cm
            clothingWidth = 86; // Chest width for XS in cm
            break;
        case 'small':
            clothingLength = 71; // Length for Small in cm
            clothingWidth = 91; // Chest width for Small in cm
            break;
        case 'medium':
            clothingLength = 74; // Length for Medium in cm
            clothingWidth = 96; // Chest width for Medium in cm
            break;
        case 'large':
            clothingLength = 76; // Length for Large in cm
            clothingWidth = 101; // Chest width for Large in cm
            break;
        case 'xl':
            clothingLength = 79; // Length for XL in cm
            clothingWidth = 106; // Chest width for XL in cm
            break;
        case 'xxl':
            clothingLength = 81; // Length for XXL in cm
            clothingWidth = 112; // Chest width for XXL in cm
            break;
        case 'xxxl':
            clothingLength = 84; // Length for XXXL in cm
            clothingWidth = 117; // Chest width for XXXL in cm
            break;
        case 'small women':
            clothingLength = 69; // Length for Small Women in cm
            clothingWidth = 86; // Bust width for Small Women in cm
            break;
        case 'medium women':
            clothingLength = 71; // Length for Medium Women in cm
            clothingWidth = 91; // Bust width for Medium Women in cm
            break;
        case 'large women':
            clothingLength = 74; // Length for Large Women in cm
            clothingWidth = 96; // Bust width for Large Women in cm
            break;
        case 'xl women':
            clothingLength = 76; // Length for XL Women in cm
            clothingWidth = 101; // Bust width for XL Women in cm
            break;
        case 'xxl women':
            clothingLength = 79; // Length for XXL Women in cm
            clothingWidth = 106; // Bust width for XXL Women in cm
            break;
        case 'xxxl women':
            clothingLength = 81; // Length for XXXL Women in cm
            clothingWidth = 112; // Bust width for XXXL Women in cm
            break;
        default:
            alert('Please select a valid clothing size.');
            return;
    }
    
    // Now you can use clothingLength and clothingWidth as needed
    

    const scaleFactor = (clothingLength / userHeightCm); // Compare clothing length to user's height
    const clothingHeightInBox = containerHeight * scaleFactor; // Scaled clothing height in pixels

    clothingImage.style.height = `${clothingHeightInBox}px`;
    clothingImage.style.width = 'auto'; // Maintain aspect ratio for width
}


function handleFileUpload(event) {
    const file = event.target.files[0];
    const userImage = document.getElementById('userImage');
    const noImageMessage = document.getElementById('noImageMessage');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userImage.src = e.target.result;
            userImage.style.display = 'block'; // Show user image
            noImageMessage.style.display = 'none'; // Hide no image message
        }
        reader.readAsDataURL(file);
    }
}


function useSampleClothing(imagePath) {
    const clothingImage = document.getElementById('clothingImage');
    clothingImage.src = imagePath;
    clothingImage.style.display = 'block'; // Show clothing image
    document.getElementById('noImageMessage').style.display = 'none'; // Hide no image message
}
// Resize clothing image after it is loaded
clothingImage.onload = resizeClothing;
