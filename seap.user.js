// ==UserScript==
// @name         SEAP
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Delete seznam emails with selected attachment types (move to trash)
// @author       https://github.com/xeaft/
// @match        https://email.seznam.cz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

window.addEventListener("load",
function() {
    'use strict';

	let Configuration = { // <= 0: Do Nothing, 1: Delete (Move to trash), >= 2: Hide locally
		Videos: 1,
		PDFs: 0,
		Presentations: 0,
		Docs: 0,
		All_Others: 0,
		Hide_Deletion: true // Tries to hide the process of deleting. Hides orange checkmarks and notifications. Does not change anything in hiding or/and doing nothing
	}

	
	if (window.location.href.search("mid=") > -1) {
		return; // E-mail is focused.
	}

    let emailsWithAttachments = Array.from(document.getElementsByClassName("icon icon-paperclip"));
	let toDeleteThings = [];
	let toHideThings = [];
    let selected = 0;

    if (Configuration.Hide_Deletion) {
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
		
		let isKnownAttach = false;

		for (let i of ["pdf", "video", "word", "powerpoint"]) {
			if (attachmentType == i) {
				isKnownAttach = true;
			}
		}

        if (attachmentType == "pdf" && Configuration.PDFs) {
          if (Configuration.PDFs == 1) {
            toDeleteThings.push(attachment);
          } else {
            toHideThings.push(attachment);
          }
        } else if (attachmentType == "video" && Configuration.Videos) {
          if (Configuration.Videos == 1) {
            toDeleteThings.push(attachment);
          } else {
            toHideThings.push(attachment);
          }
        } else if (attachmentType == "word" && Configuration.Docs) {
          if (Configuration.Docs == 1) {
            toDeleteThings.push(attachment);
          } else {
            toHideThings.push(attachment);
          }
        } else if (attachmentType == "powerpoint" && Configuration.Presentations) {
          if (Configuration.Presentations == 1) {
            toDeleteThings.push(attachment);
          } else {
            toHideThings.push(attachment);
          }
        } else if (!isKnownAttach && Configuration.All_Others){
          if (Configuration.All_Others == 1) {
            toDeleteThings.push(attachment);
          } else {
            toHideThings.push(attachment);
          }
        }
    }


    for (let i of toDeleteThings) {
        try {
		    let msg = getMessageOfAttElement(i);
            let checkbox = getMessageCheckbox(msg);
            checkbox.click();
            selected++;
        } catch {}
	}

	for (let i of toHideThings) {
		try {
			let msg = getMessageOfAttElement(i);
			msg.style.display = "none"; // alt .remove()
		} catch {}
	}

    if (selected) {
        delButton.click();
    }

    if (Configuration.Hide_Deletion) {
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
