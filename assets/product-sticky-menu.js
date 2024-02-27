const anchorPoints = document.querySelectorAll(".anchor-point");

for (var i = 0; i < anchorPoints.length; i++) {
    const anchorName = anchorPoints[i].getAttribute("name");
    const anchorID = anchorPoints[i].getAttribute("id");
    console.log('Anchor Point Name: ', anchorName, ' ID: ', anchorID);
}