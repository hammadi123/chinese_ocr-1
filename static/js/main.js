function convertImageToCanvas(image, response) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drwaImage(image, 0, 0);
}

function getBase64FromImageUrl(url) {
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');
    var png = "";
    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        //console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        png = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };

    img.src = url;

}

function getBase64FromImageUrl(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    //console.log(dataURL)
    return dataURL;
}

function convertBase64UrlToBlob(urlData) {

    var bytes = window.atob(urlData.split(',')[1]);
    //var bytes = window.atob(urlData);

    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/png' });
}

function submitImage(url) {
    var image = new Image();
    image.src = url;
    image.crossOrigin="anonymous"
    image.onload = function() {
        var code = getBase64FromImageUrl(image);
        var blob = convertBase64UrlToBlob(code);

        var myFile = new File([blob], "test.png")
        
        var stylePara = getValue();
        var formData = new FormData();
        formData.append('image', myFile);
        formData.append('style', stylePara);
     
        $.ajax({
            url: "/upload",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,

            success: function(data) {
                console.log(data)
                //alert(data.bounding_boxes[0])
                //drawBoxOnCanvas(image, data)
                var res = JSON.parse(data)
                var content = res.res.split(" ")
                var rst = ""
                for(let i = 0; i < content.length; i++) {
                    rst = rst + content[i] + "<br />";
                }
                document.getElementById("text").innerHTML = rst
            },
            error: function(data) {
                console.log('fail')
            }
        });
}
}

var input = document.getElementById("upload_image");
if (window.FileReader) {
    input.addEventListener("change", imageUpload, false);
} else {
    alert("浏览器不支持!!!!!!!");
}

function imageUpload(e) {
    var file = e.target.files[0];
    if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }
    submitImage(URL.createObjectURL(file));
}

function AutoResizeImage(maxWidth, maxHeight, objImg) {
    var img = new Image();
    imsrc = objImg.src;
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = img.width;
    var h = img.height;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth == 0 && maxHeight == 0) {
        Ratio = 1;
    } else if (maxWidth == 0) { //
        if (hRatio < 1) Ratio = hRatio;
    } else if (maxHeight == 0) {
        if (wRatio < 1) Ratio = wRatio;
    } else if (wRatio < 1 || hRatio < 1) {
        Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
        w = w * Ratio;
        h = h * Ratio;
    }
    objImg.height = h;
    objImg.width = w;
}

function submitImageURL() {
    var url = document.getElementById("online_image_url").value;
    submitImage(url);
}

function getValue(){
    var radio = document.getElementsByName("style");
    for (let i=0; i<radio.length; i++) {
        if(radio[i].checked) {
            return radio[i].value;
        }
    }
}