# Easy Ajax File Uploader jQuery Plugin #

This is a simple jQuery plugin to upload file by ajax (based on [jfeldstein/jQuery.AjaxFileUpload.js][afu] plugin)

## Requirements
* jQuery 1.4+


## Tested on
* IE 10
* Opera 12
* Firefox 19
* Chrome 25
* Safari 5

## Use
### Simple initialization
```js
$('#file-input').easyajaxupload({action:'upload.php'});
```

### Advanced initialization
```js
$('#file-input').easyajaxupload({
    action:'upload.php',
    params: {
        extra: 'info'
    },
    onComplete: function (response) { 
        console.log('custom handler for file:');
        alert(JSON.stringify(response));
    },
    onStart: function () { 
        if(weWantedTo) return false; // cancels upload
    },
    
    onCancel: function () { 
        console.log('no file selected'); 
    }
});
```

### Upload file
```js
$('#file-input').easyajaxupload('upload');
```

 [afu]: http://github.com/jfeldstein/jQuery.AjaxFileUpload.js