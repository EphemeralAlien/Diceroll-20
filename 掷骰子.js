/**
 * CTE - D20 Dice Roller (regex-driven)
 *
 * 目标：点击“掷骰子”按钮，仅发送一条消息“点击掷骰”。
 * 之后由酒馆的正则把文本替换为 .cte-d20-regex-cta 元素，
 * 点击该元素由 regex_click_handler.html 负责 roll 与触发 AI。
 */
/* global TavernHelper, SillyTavern, eventOnButton, appendInexistentScriptButtons, getScriptId, jQuery, toastr */
(function () {
  const SCRIPT_ID = 'cte_in_chat_dice_roller_min';
  let isExecuting = false;

  try {
    // 防重复初始化
    if (document && document.body && document.body.getAttribute('data-cte-dice-min-init') === 'true') return;
    if (document && document.body) document.body.setAttribute('data-cte-dice-min-init', 'true');

    if (typeof jQuery === 'undefined' || typeof TavernHelper === 'undefined') {
      if (typeof toastr !== 'undefined') toastr.error('掷骰子脚本加载失败：缺少必要的组件。');
      return;
    }

    // 确保按钮存在
    try {
      if (typeof appendInexistentScriptButtons === 'function' && typeof getScriptId === 'function') {
        appendInexistentScriptButtons(getScriptId(), [{ name: '掷骰子', visible: true }]);
      }
    } catch (_) {
      /* ignore */
    }

    const startDiceRoll =
      TavernHelper && TavernHelper.errorCatched
        ? TavernHelper.errorCatched(async function () {
            if (isExecuting) return;
            isExecuting = true;
            try {
              // 去重：若最近一条用户消息已是“点击掷骰”，则不再发送
              try {
                const lastUserMessages =
                  typeof TavernHelper.getChatMessages === 'function'
                    ? TavernHelper.getChatMessages(-1, { role: 'user' })
                    : [];
                const last = Array.isArray(lastUserMessages) && lastUserMessages.length ? lastUserMessages[0] : null;
                const lastText = last ? String(last.message ?? last.mes ?? '').trim() : '';
                if (lastText === '点击掷骰') return;
              } catch (_) {}

              await TavernHelper.triggerSlash('/send 点击掷骰');
            } finally {
              setTimeout(function () {
                isExecuting = false;
              }, 600);
            }
          })
        : async function () {
            if (isExecuting) return;
            isExecuting = true;
            try {
              // 去重：若最近一条用户消息已是“点击掷骰”，则不再发送
              try {
                const lastUserMessages =
                  typeof TavernHelper.getChatMessages === 'function'
                    ? TavernHelper.getChatMessages(-1, { role: 'user' })
                    : [];
                const last = Array.isArray(lastUserMessages) && lastUserMessages.length ? lastUserMessages[0] : null;
                const lastText = last ? String(last.message ?? last.mes ?? '').trim() : '';
                if (lastText === '点击掷骰') return;
              } catch (_) {}

              await TavernHelper.triggerSlash('/send 点击掷骰');
            } finally {
              setTimeout(function () {
                isExecuting = false;
              }, 600);
            }
          };

    if (typeof eventOnButton === 'function') {
      eventOnButton('掷骰子', startDiceRoll);
    }
  } catch (e) {
    console.error('Dice roller script (min) failed to initialize:', e);
    if (typeof toastr !== 'undefined') toastr.error('掷骰子脚本初始化时发生严重错误。');
  }
})();
