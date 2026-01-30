exports.detect = (text) => {
    // Placeholder for intent classification logic
    // Could use a regex map or call an LLM
    if (/order|buy|get/i.test(text)) return 'ORDER';
    if (/track|where/i.test(text)) return 'TRACK_ORDER';
    return 'GENERAL_QUERY';
};
