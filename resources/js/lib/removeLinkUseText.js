/**
 * Receives a link as HTML and removes the link and returns clean text
 * @param inputStr
 * @returns {*}
 */
function removeLinkUseText(inputStr) {
    if(!window.plugna.session.rlut ) {
        window.plugna.session.rlut = document.createElement('template');
    }
    inputStr = inputStr.trim(); // Never return a text node of whitespace as the result
    window.plugna.session.rlut.innerHTML = inputStr;
    return window.plugna.session.rlut.content.firstChild.textContent;
}
export default removeLinkUseText