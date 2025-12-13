function buildThingsAddUrl({ title, notes, showQuickEntry = true } = {}) {
    const params = [];
    if (title) params.push(`title=${encodeURIComponent(title)}`);
    if (showQuickEntry) params.push("show-quick-entry=true");
    if (notes) params.push(`notes=${encodeURIComponent(notes)}`);
    return `things:///add?${params.join("&")}`;
}

function normalizeTitle(rawTitle) {
    if (!rawTitle) return "";
    const title = rawTitle.toString().replace(/\s+/g, " ").trim();
    return title.length > 200 ? `${title.slice(0, 197)}...` : title;
}

function openThingsQuickEntry({ title, notes } = {}) {
    const url = buildThingsAddUrl({
        title: normalizeTitle(title),
        notes,
        showQuickEntry: true,
    });
    chrome.tabs.create({ url });
}

chrome.action.onClicked.addListener((activeTab) => {
    openThingsQuickEntry({
        title: activeTab?.title,
        notes: activeTab?.url ? `Link: ${activeTab.url}` : undefined,
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "thingsAddLink",
            title: "Add link to Things",
            contexts: ["link"],
        });

        chrome.contextMenus.create({
            id: "thingsAddSelection",
            title: "Add selection to Things",
            contexts: ["selection"],
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "thingsAddLink") {
        openThingsQuickEntry({
            title: tab?.title || info.linkUrl,
            notes: info.linkUrl ? `Link: ${info.linkUrl}` : undefined,
        });
        return;
    }

    if (info.menuItemId === "thingsAddSelection") {
        const pageUrl = info.pageUrl || tab?.url;
        openThingsQuickEntry({
            title: info.selectionText,
            notes: pageUrl ? `Link: ${pageUrl}` : undefined,
        });
    }
});
