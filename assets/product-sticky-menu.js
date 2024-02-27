var anchorPoints = document.querySelectorAll(".anchor-point");


for (var i = 0; i < anchorPoints.length; i++) {
    var anchorName = anchorPoints[i].getAttribute("data-name");
    var anchorID = anchorPoints[i].getAttribute("id");
    console.log('Anchor Point Name: ' + anchorName + ' ID: ' + anchorID);
}