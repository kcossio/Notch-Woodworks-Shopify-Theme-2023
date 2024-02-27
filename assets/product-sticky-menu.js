var anchorPoints = document.querySelectorAll(".anchor-point");


for (var i = 0; i < anchorPoints.length; i++) {
    var anchorName = anchorPoints[i].getAttribute("data-name");
    var anchorID = anchorPoints[i].getAttribute("id");

    let newElement = document.createElement("li");
    newElement.innerHTML += '<a href="#' + anchorID + '">' + anchorName + '</a>';
    //console.log('Anchor Point Name: ' + anchorName + ' ID: ' + anchorID);

    document.getElementById("sticky-product-menu").append(newElement);
}