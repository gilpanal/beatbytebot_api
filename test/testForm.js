/* https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript */
// Because we want to access DOM nodes,
// we initialize our script at page load.

window.addEventListener('load', () => {

    // These variables are used to store the form data
    const chatField = document.getElementById('theText')
    const userInfo = document.getElementById('theUserText')
    const file = {
        dom: document.getElementById('theFile'),
        binary: null
    }

    // Use the FileReader API to access file content
    const reader = new FileReader()

    // Because FileReader is asynchronous, store its
    // result when it finishes to read the file
    reader.addEventListener('load', () => {
        file.binary = reader.result
    })

    // At page load, if a file is already selected, read it.
    if (file.dom.files[0]) {
        reader.readAsBinaryString(file.dom.files[0])
    }

    // If not, read the file once the user selects it.
    file.dom.addEventListener('change', () => {
        if (reader.readyState === FileReader.LOADING) {
            reader.abort()
        }
        reader.readAsBinaryString(file.dom.files[0])
    })

    // sendData is our main function
    function sendData() {
        // If there is a selected file, wait it is read
        // If there is not, delay the execution of the function
        if (!file.binary && file.dom.files.length > 0) {
            setTimeout(sendData, 10)
            return
        }

        // To construct our multipart form data request,
        // We need an XMLHttpRequest instance
        const XHR = new XMLHttpRequest()
        
        const formData = new FormData()
        if(chatField && chatField.value){
            formData.append(chatField.name, chatField.value)
        }
        if(file && file.dom.files[0]){
            formData.append(file.dom.name, file.dom.files[0], file.dom.files[0].name)             
        }
        if(userInfo && userInfo.value){                        
            formData.append('user_info', userInfo.value) 
        } 

        // Define what happens on successful data submission
        XHR.addEventListener('load', (event) => {
            console.log(event.srcElement.response)            
        })

        // Define what happens in case of error
        XHR.addEventListener('error', (event) => {
            console.log(event)            
        })

        // Set up our request
        XHR.open('POST', '/fileUpload')

        // And finally, send our data.        
        XHR.send(formData)
    }

    // Access our form...
    const form = document.getElementById('theForm')

    // ...to take over the submit event
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        sendData()
    })
})