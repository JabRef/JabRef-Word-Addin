/* global Word OfficeExtension */

export default function createContentControl(html: string) {
  Word.run(function (context) {
    var serviceNameRange = context.document.getSelection();
    var serviceNameContentControl = serviceNameRange.insertContentControl();
    serviceNameContentControl.tag = "jabref";
    serviceNameContentControl.appearance = "BoundingBox";
    serviceNameContentControl.color = "white";
    serviceNameContentControl.insertHtml(html, "Replace");
    return context.sync();
  }).catch(function (error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
      console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
  });
}
