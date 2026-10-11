/**
 * Extracts and shrinks page interactive DOM nodes for fast, high-accuracy LLM reasoning
 */
const extractInteractiveDOM = async (page) => {
  try {
    const elements = await page.evaluate(() => {
      // Find all potentially interactive or significant elements
      const candidates = document.querySelectorAll(
        'button, a, input, select, textarea, form, [role="button"], [data-testid], h1, h2, h3, .price, .badge, [id], [class*="btn"], [class*="pay"], [class*="cart"]'
      );

      const items = [];
      const seen = new Set();

      candidates.forEach((el, index) => {
        // Skip hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          return;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        // Extract key identifying attributes
        const tagName = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const className = el.className && typeof el.className === 'string' 
          ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
          : '';
        const text = (el.innerText || el.textContent || el.value || el.placeholder || '').trim().replace(/\s+/g, ' ').substring(0, 80);
        const role = el.getAttribute('role') || '';
        const type = el.getAttribute('type') || '';
        const testId = el.getAttribute('data-testid') || '';
        const isDisabled = el.disabled || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled');

        // Form unique key
        const uniqueKey = `${tagName}_${id}_${className}_${text.substring(0, 20)}`;
        if (seen.has(uniqueKey)) return;
        seen.add(uniqueKey);

        items.push({
          index,
          tag: tagName,
          id: el.id || null,
          classes: el.className && typeof el.className === 'string' ? el.className.trim() : null,
          suggestedSelector: id || (testId ? `[data-testid="${testId}"]` : null) || (text ? `${tagName}:has-text("${text}")` : null) || className || tagName,
          text,
          role,
          type,
          'data-testid': testId || null,
          disabled: isDisabled,
          position: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          }
        });
      });

      // Also grab key page context like headings, errors or cart total
      const pageTextSnippet = document.body.innerText.replace(/\s+/g, ' ').substring(0, 500);

      return {
        elements: items.slice(0, 40), // Top 40 relevant interactive nodes
        pageSnippet: pageTextSnippet
      };
    });

    return elements;
  } catch (err) {
    return {
      elements: [],
      pageSnippet: 'Failed to extract DOM: ' + err.message
    };
  }
};

module.exports = { extractInteractiveDOM };
