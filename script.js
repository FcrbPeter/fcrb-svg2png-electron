let imageFilePath = '';

window.addEventListener('DOMContentLoaded', function() {
    const imageButton = document.querySelector('#image')
    const imagePath = document.querySelector('#image-path')
    const message = document.querySelector('#msg')
    const convertButton = document.querySelector('#convert')

    // ipcRenderer.on('convert-complete', function(_) {
    //     console.log('convert complete');
    // });

    imageButton.addEventListener('click', async function() {
        const filePath = await window.electron.openFile();

        if(filePath) {
            imagePath.innerHTML = imageFilePath = filePath;
        }
    })

    convertButton.addEventListener('click', async function() {
        message.innerHTML = 'Please wait....'
        convertButton.disabled = true;

        try {
            await window.electron.convertImage(imageFilePath);

            message.innerHTML = 'Completed.'
        } catch(e) {
            message.innerHTML = 'Fail. ' + e.message
        }

        convertButton.disabled = false;
    })
})
