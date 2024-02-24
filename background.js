
async function getOldRulesIds() {
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRulesIds = oldRules.map(rule => rule.id);
  return oldRulesIds
}

async function stopRedirect() {
  
  await chrome.runtime.onInstalled.addListener();
  const oldRulesIds = await getOldRulesIds();

  await chrome.declarativeNetRequest.updateDynamicRules({
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
  }, async ()=> {
    await chrome.storage.local.set({"animeflvsinredirect": "yes"});
  });

}

try {
  stopRedirect();
} catch (error) {
  console.error(error);
}

/**
  "^https:\/\/www3\.animeflv\.net(\/.*)?$";
  "^(http|https):\/\/www3\.animeflv\.net(\/.*)?$";
 */