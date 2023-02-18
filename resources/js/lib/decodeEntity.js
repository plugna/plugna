function decodeEntity(inputStr) {
    if(!window.plugna.session.decode_entities ) {
        window.plugna.session.decode_entities = document.createElement("textarea");
    }
    window.plugna.session.decode_entities.innerHTML = inputStr;
    return  window.plugna.session.decode_entities.value;
}

export default decodeEntity