// ==UserScript==
// @name         SEAP
// @namespace    http://tampermonkey.net/
// @version      2024-11-03
// @description  Delete seznam emails with selected attachment tyoes
// @author       https://github.com/xeaft/
// @match        https://email.seznam.cz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

window.addEventListener("load",
function() {
    'use strict';

    let DELETE_VIDEOS = true;
    let DELETE_PDFS = false;
    let DELETE_POWERPOINTS = false;
    let DELETE_DOCS = false;
    let DELETE_OTHERS = false;

    let HIDE_DELETE = true;

    let emailsWithAttachments = Array.from(document.getElementsByClassName("icon icon-paperclip"));
    let videos = [];
    let powerpoints = [];
    let pdfs = [];
    let docs = [];
    let other = [];

    let selected = 0;

    if (HIDE_DELETE) {
        const style = document.createElement('style');
        style.id = "NO_CHECKBOX_STYLE"

        style.textContent = `
        :root {
          --img-checkbox-checked: none;
        }

        wm-notification {
          display: none;
        }
    `;

        document.head.appendChild(style);
    }


    function getDelButton() {
        let delButtons = Array.from(document.getElementsByClassName("icon icon-delete"))
        for (let i of delButtons) {
            let span = i.parentElement.getElementsByTagName("span")[0];
            if (!span) {
                continue;
            }
            if (span.innerText == "Smazat") {
                return i.parentElement;
            }
        }
    }

    let delButton = getDelButton();

    function getMessageOfAttElement(att) {
        return att.parentElement.parentElement.parentElement;
    }

    function getMessageCheckbox(msg) {
        return msg.querySelector(".select > input[type='checkbox']");
    }

    for (let attachment of emailsWithAttachments) {
        let attParent = attachment.parentElement.getElementsByTagName("span")[0];
        if (!attParent) {
            continue;
        }

        let attachmentType = attParent.innerText.toLowerCase();

        if (attachmentType == "pdf") {
            pdfs.push(attachment);
        } else if (attachmentType == "video") {
            videos.push(attachment);
        } else if (attachmentType == "word") {
            docs.push(attachment);
        } else if (attachmentType == "powerpoint") {
            powerpoints.push(attachment);
        } else {
            other.push(attachment);
        }
    }

    if (DELETE_VIDEOS) {
        for (let i of videos) {
            try {
                let msg = getMessageOfAttElement(i);
                let checkbox = getMessageCheckbox(msg);
                checkbox.click();
                selected++;
            } catch {}
        }
    }

    if (DELETE_PDFS) {
        for (let i of pdfs) {
            try {
                let msg = getMessageOfAttElement(i);
                let checkbox = getMessageCheckbox(msg);
                checkbox.click();
                selected++;
            } catch {}
        }
    }

    if (DELETE_POWERPOINTS) {
        for (let i of powerpoints) {
            try {
                let msg = getMessageOfAttElement(i);
                let checkbox = getMessageCheckbox(msg);
                checkbox.click();
                selected++;
            } catch {}
        }
    }

    if (DELETE_DOCS) {
        for (let i of docs) {
            try {
                let msg = getMessageOfAttElement(i);
                let checkbox = getMessageCheckbox(msg);
                checkbox.click();
                selected++;
            } catch {}
        }
    }

    if (DELETE_OTHERS) {
        for (let i of other) {
            try {
                let msg = getMessageOfAttElement(i);
                let checkbox = getMessageCheckbox(msg);
                checkbox.click();
                selected++;
            } catch {}
        }
    }

    if (selected) {
        delButton.click();
    }

    if (HIDE_DELETE) {
        const style2 = document.createElement('style');
          style2.textContent = `
          wm-notification {
            display: none;
          }
        `;

        document.getElementById("NO_CHECKBOX_STYLE").remove();
        document.head.appendChild(style2);
  }
});
