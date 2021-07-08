/* global Word */

function createContentControl(tag: string, html: string) {
  Word.run(function (context) {
    var serviceNameRange = context.document.getSelection();
    var serviceNameContentControl = serviceNameRange.insertContentControl();
    serviceNameContentControl.title = "jabref";
    serviceNameContentControl.tag = tag;
    serviceNameContentControl.appearance = "BoundingBox";
    serviceNameContentControl.color = "white";
    serviceNameContentControl.title = "kmklms";
    serviceNameContentControl.insertHtml(html, "Replace");

    return context.sync();
  }).catch(function (error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}

function replaceContentInControl(tag: string, html: string, position: number) {
  Word.run(function (context) {
    var serviceNameContentControl = context.document.contentControls.getByTag(tag);
    serviceNameContentControl.insertText("Fabrikam Online Productivity Suite", "Replace");
    return context.sync();
  }).catch(function (error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}
