
async function getOldRulesIds2() {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRulesIds = oldRules.map(rule => rule.id);
  return oldRulesIds
}

async function stopRedirect2(toggleSwitch) {

  if (toggleSwitch.checked) {
    const oldRulesIds = await getOldRulesIds2();
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRulesIds,
      addRules: [
        {
          id: 123123,
          priority: 1,
          action: {
            type: 'block'
          },
          condition: {
            resourceTypes: ['main_frame']
          }
        },
        {
          id: 456456,
          priority: 2,
          action: {
            type: 'allow'
          },
          condition: {
            urlFilter: "https://www3.animeflv.net*",
            resourceTypes: ['main_frame']
          }
        }
      ]
    }, () => {
      chrome.storage.local.set({"animeflvsinredirect": "yes"});
    });

  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [123123, 456456]
    }, () => {
      chrome.storage.local.set({"animeflvsinredirect": "no"});
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const { animeflvsinredirect } = await chrome.storage.local.get(["animeflvsinredirect"]);

  toggleSwitch.checked = animeflvsinredirect === "yes" ? true : false;

  if (!toggleSwitch.checked) {
    chrome.storage.local.set({ "animeflvsinredirect": "no" });
  }


  toggleSwitch.addEventListener('change', () => {
    try {
      stopRedirect2(toggleSwitch);
    } catch (error) {
      console.error(error);
    }
  });
});


