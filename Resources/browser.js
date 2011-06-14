var windowBrowser = Titanium.UI.currentWindow;

var viewBrowser = Titanium.UI.createView({
    left: 0,
    top: 0,
    width: 320,
    height: 411,
    backgroundColor: '#ffffff'
});

var webView = Titanium.UI.createWebView({
    url: 'http://www.google.fi/',
    left: 0,
    top: 48,
    width: 320,
    height: 363,
    backgroundColor: '#ffffff'
});
viewBrowser.add(webView);

var textURL = Titanium.UI.createTextField({
    borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    left: 6,
    top: 9,
    width: 244,
    height: 31,
    value: '',
    color: '#000000'
});
viewBrowser.add(textURL);

var btnGo = Titanium.UI.createButton({
    left: 255,
    top: 7,
    width: 60,
    height: 35,
    title: 'Avaa',
    color: '#324f85'
});

btnGo.addEventListener('click', function()
{
    webView.url = "http://"+textURL.value;
});


viewBrowser.add(btnGo);
windowBrowser.add(viewBrowser);

