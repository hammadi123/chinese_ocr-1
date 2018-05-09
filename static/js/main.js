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

        var formData = new FormData();
        formData.append('image', myFile);

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
                document.getElementById("text").innerHTML = data
            },
            error: function(data) {
                console.log('fail')
            }
        });
}
}

function draw() {
    var c = document.getElementById("myCanvas");
    var cxt = c.getContext("2d");
    var img = new Image();

    img.src = "/static/media/img/test.jpg"
    img.onload = function() {
        cxt.drawImage(img, 0, 0)
        cxt.strokeStyle = "rgba(200, 0, 0, 0.9)"
        cxt.strokeRect(100.32976430654526, 137.1965465694666, 236, 294)
        //cxt.strokeRect(336.9286530315876, 430.32099076360464, 10, 10)
        cxt.strokeRect(173, 267, 10, 10)
        cxt.strokeRect(281, 271, 10, 10)
        cxt.strokeRect(229, 345, 10, 10)
        cxt.strokeRect(178, 369, 10, 10)
        cxt.strokeRect(261, 369, 10, 10)
    }
}

function drawBoxOnCanvas(image, response) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var cxt = canvas.getContext("2d");

    cxt.drawImage(image, 0, 0);
    cxt.strokeStyle = "#3498DB";
    cxt.fillStyle = "#FF1493";
    cxt.lineWidth = 6;
    cxt.lineJoin = 'round';

    for (var i = 0; i < response.bounding_boxes.length; i++) {
        var box = response.bounding_boxes[i]
        var leftUp = [box[0], box[1]];
        var rightDown = [box[2], box[3]];

        cxt.strokeRect(leftUp[0], leftUp[1], rightDown[0] - leftUp[0], rightDown[1] - leftUp[1]);
    }

    for (var j = 0; j < response.landmarks.length; j++) {
        for (var i = 0; i < response.landmarks[j].length; i++) {
            var landmark = response.landmarks[j][i];

            cxt.beginPath();
            cxt.arc(landmark[0], landmark[1], 6, 0, 2 * Math.PI);
            cxt.fill();
        }
    }


    var newSrc = canvas.toDataURL("image/jpeg");

    var labels = response.labels;
    var similarities = response.similarity;
    var label_container = document.getElementById("label_container");
    label_container.innerHTML = "";
    if(typeof(labels.length) != undefined && labels.length < 3) {
        for(var i = 0; i < labels.length; i++) {
            similarity = similarities[i];

            var flag_content = "";
            var label_content = labels[i];
            if(similarity < 0.95) {
                flag_content = "Bingo!!";
                similarity = "Confidence: high";
            } else if(similarity > 1.05) {
                flag_content = "Can't locate your feature in our database..."
                similarity = "";
                label_content = "";
            } else {
                flag_content = "Maybe you are: "
                similarity = "Confidence: medium";
            }

            var first_line = document.createElement("p");
            var first_line_content = document.createTextNode(flag_content);
            first_line.appendChild(first_line_content);
            label_container.appendChild(first_line);

            if(label_content != "") {

                var second_line = document.createElement("p");
                var second_line_content = document.createTextNode(label_content);
                second_line.appendChild(second_line_content);

                var b = document.createElement("br");
                second_line.appendChild(b);
                var third_line_content = document.createTextNode(similarity);
                second_line.appendChild(third_line_content);
                //var third_line_content = document.createTextNode(similarity);
                //var third_line = document.createElement("p");
                //third_line.appendChild(third_line_content);

                label_container.appendChild(second_line);
                //label_container.appendChild(third_line);
            }
            //label_container.appendChild(document.createElement("p").appendChild(document.createTextNode(label_content)));
            //label_container.appendChild(document.createElement("p").appendChild(document.createTextNode("\n")));
            //label_container.appendChild(document.createElement("p").appendChild(document.createTextNode(similarity)));

        }
    }

    document.getElementById("json_container").innerHTML="";
    document.getElementById("json_container").appendChild(document.createTextNode(JSON.stringify(response, null, 4)));
    //document.getElementById("currentImg").setAttribute('src', newSrc);
    //document.getElementById("currentImg").setAttribute('onclick', "");
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

function activeCamera() {
    Webcam.set({
        width: 320,
        height: 240,
        dest_width: 640,
        dest_height: 480,
        image_format: 'jpeg',
        jpeg_quality: 90,
        force_flash: false,
        flip_horiz: true,
        fps: 45
    });
    Webcam.attach('#my_camera');
    document.getElementById("snapshot_button").setAttribute("onclick", "close_camera()");
    document.getElementById("snapshot_button").innerHTML = "<i class='camera retro icon'></i>Close Camera"
}

function take_snapshot() {
    Webcam.snap( function(data_uri) {
    submitImage(data_uri);
    });
}

function close_camera() {
    Webcam.reset();
    document.getElementById("snapshot_button").setAttribute("onclick", "activeCamera()");
    document.getElementById("snapshot_button").innerHTML = "<i class='camera retro icon'></i>Open Camera"
}

function submitImageURL() {
    var url = document.getElementById("online_image_url").value;
    submitImage(url);
}
