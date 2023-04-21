/*
 *   iframeSRC: 'https://s3.amazonaws.com/ieee-mkto-cross-domain/index.html',
 *   munchkinCode: '756-GPH-899',
 *   munchkinCodeParams: {}
 */
(function (iframeSRC, munchkinURL, munchkinCode, munchkinCodeParams, formID) {
    munchkinCodeParams = munchkinCodeParams || {}
    if (iframeSRC === null || iframeSRC === undefined || typeof (iframeSRC) !== "string") {
        return;
    } else if (munchkinCode === null || munchkinCode === undefined || typeof (munchkinCode) !== "string") {
        return;
    } else {
        window.addEventListener('load', () => {
            window.addEventListener('message', (msg) => {
                if (iframeSRC.includes(msg.origin) === false && msg.origin !== munchkinURL) {
                    return;
                }
                if (msg.data === "not available") {
                    (function () {
                        var didInit = false;

                        function initMunchkin() {
                            if (didInit === false) {
                                didInit = true;
                                Munchkin.init(munchkinCode, munchkinCodeParams);
                                let intervalCounter = 0;
                                let cookieCheckInterval = setInterval(() => {
                                    let checkCookie = document.cookie.split('; ').filter(cookie => cookie.includes("_mkto_trk"))
                                    if (checkCookie.length > 0) {
                                        document.getElementById('myframe').contentWindow.postMessage(checkCookie[0], iframeSRC);
                                        document.getElementsByTagName('body')[0].appendChild(newScriptTag);

                                        window.clearInterval(cookieCheckInterval);
                                    } else if (intervalCounter === 10) {
                                        window.clearInterval(cookieCheckInterval);
                                    }
                                    intervalCounter++
                                }, 500)
                            }
                        }
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = '//munchkin.marketo.net/munchkin.js';
                        s.onreadystatechange = function () {
                            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                                initMunchkin();
                            }
                        };
                        s.onload = initMunchkin;
                        document.getElementsByTagName('head')[0].appendChild(s);
                    })();

                } else {
                    if (document.cookie.split('; ').filter(cookie => cookie.includes("_mkto_trk")).length === 0) {
                        document.cookie = msg.data;
                    }
                    (function () {
                        var didInit = false;

                        function initMunchkin() {
                            if (didInit === false) {
                                didInit = true;
                                Munchkin.init(munchkinCode, munchkinCodeParams);
                                document.getElementsByTagName('body')[0].appendChild(newScriptTag);
                            }
                        }
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = '//munchkin.marketo.net/munchkin.js';
                        s.onreadystatechange = function () {
                            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                                initMunchkin();
                            }
                        };
                        s.onload = initMunchkin;
                        document.getElementsByTagName('head')[0].appendChild(s);
                    })();
                }
            })

            function getInitialCookie() {
                document.getElementById('myframe').contentWindow.postMessage('get', iframeSRC);
            }

            let hiddenIframe = document.createElement('iframe');
            hiddenIframe.style = 'width:0px;height:0px;border:none';
            hiddenIframe.id = 'myframe';
            hiddenIframe.src = iframeSRC;
            hiddenIframe.onload = getInitialCookie
            document.getElementsByTagName('body')[0].appendChild(hiddenIframe);
            let innerhtml = "MktoForms2.loadForm('" + munchkinURL + "', '" + munchkinCode + "', " + formID + ");"
            let newScriptTag = document.createElement("script");
            newScriptTag.setAttribute("type", "text/javascript");
            newScriptTag.textContent = innerhtml;
        })


    }
})("https://s3.amazonaws.com/ieee-mkto-cross-domain/index.html", "https://app-ab24.marketo.com", '756-GPH-899', {domainLevel: 4}, 1023)
