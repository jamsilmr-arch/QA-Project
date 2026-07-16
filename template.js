/**
 * [자가 복구형 다중 양식 메모 보드]
 * index.html에 패널 태그가 누락되었더라도 스크립트가 스스로 DOM을 주입하여 렌더링을 강제합니다.
 */
window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Template = window.QA_CORE.Template || {};

window.QA_CORE.Template.Manager = {
    memos: [],

    init() {
        this.ensureDomExists(); // 💡 [핵심] HTML 도화지가 없으면 강제 생성
        this.loadData();
        this.renderLayout();
        this.bindGlobalEvents();
    },

    ensureDomExists() {
        let panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                panelZone = document.createElement('div');
                panelZone.id = 'tab-panel-template';
                panelZone.className = 'content-panel';
                // 탭 활성화 상태와 동기화하기 위해 active 클래스 부여 (초기 렌더링용)
                panelZone.classList.add('active'); 
                mainContent.appendChild(panelZone);
                console.log("[Auto-Mount] tab-panel-template 컨테이너 자동 생성 완료");
            } else {
                console.error("치명적 결함: main-content 컨테이너를 찾을 수 없습니다.");
            }
        }
    },

    loadData() {
        const data = localStorage.getItem('QA_CORE_MEMO_TEMPLATES');
        if (data) {
            try { 
                this.memos = JSON.parse(data); 
            } catch(e) { 
                this.memos = []; 
            }
        } 
        
        if (this.memos.length === 0) {
            this.memos = [{
                id: Date.now(),
                content: "[Environment]\n■ PoC : \n■ Device(OS Ver.) : \n■ App : \n■ Server : \n\n[Pre-Condition]\n1. \n\n[재현스텝]\n1. \n2. \n3. \n\n[실행결과-문제현상]\n1. \n\n[기대결과]\n1. "
            }];
        }
    },

    saveData() {
        localStorage.setItem('QA_CORE_MEMO_TEMPLATES', JSON.stringify(this.memos));
    },

    renderLayout() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;

        panelZone.innerHTML = `
            <div style="padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 600px; height: 100%; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #cbd5e0; padding-bottom: 12px;">
                    <div>
                        <h2 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">📝 다중 양식 메모 보드</h2>
                        <p style="font-size: 12px; color: #64748b; margin: 0;">작성 내용은 키보드 입력 시 브라우저에 실시간 자동 저장됩니다.</p>
                    </div>
                    <button id="btn-add-memo" style="background:#0f172a; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        + 칸 추가
                    </button>
                </div>
                
                <div id="memo-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
                </div>
            </div>
        `;
        this.renderMemos();
    },

    renderMemos() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.memos.forEach(memo => {
            const card = document.createElement('div');
            card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03);";
            
            card.innerHTML = `
                <div style="display: flex; justify-content: flex-end; gap: 6px; margin-bottom: 8px;">
                    <button class="btn-copy-memo" data-id="${memo.id}" style="background: #e0f2fe; color: #0284c7; border: none; padding: 4px 12px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">복사</button>
                    <button class="btn-delete-memo" data-id="${memo.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 4px 12px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">삭제</button>
                </div>
                <textarea class="memo-textarea" data-id="${memo.id}" style="width: 100%; height: 350px; resize: vertical; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; font-family: 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.5; color: #334155; outline: none; box-sizing: border-box; background: #f8fafc;" placeholder="여기에 양식을 입력하세요...">${memo.content}</textarea>
            `;
            container.appendChild(card);
        });
        
        this.bindDynamicEvents();
    },

    bindGlobalEvents() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;
        
        // 메모 보드 컨테이너 레벨에 이벤트 위임 (중복 바인딩 방어)
        panelZone.onclick = (e) => {
            if (e.target.id === 'btn-add-memo') {
                this.memos.push({ id: Date.now(), content: "" });
                this.saveData();
                this.renderMemos();
            }
        };
    },

    bindDynamicEvents() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;

        const textareas = container.querySelectorAll('.memo-textarea');
        textareas.forEach(ta => {
            ta.oninput = (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo) {
                    memo.content = e.target.value;
                    this.saveData();
                }
            };
        });

        const copyBtns = container.querySelectorAll('.btn-copy-memo');
        copyBtns.forEach(btn => {
            btn.onclick = (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo && memo.content) {
                    navigator.clipboard.writeText(memo.content).then(() => {
                        if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                            window.QA_CORE.UI.showToast("✅ 클립보드에 복사되었습니다.");
                        } else {
                            alert("✅ 클립보드에 복사되었습니다.");
                        }
                    }).catch(() => alert("복사에 실패했습니다."));
                }
            };
        });

        const delBtns = container.querySelectorAll('.btn-delete-memo');
        delBtns.forEach(btn => {
            btn.onclick = (e) => {
                if(confirm("해당 양식을 완전히 삭제하시겠습니까? (복구 불가)")) {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.memos = this.memos.filter(m => m.id !== id);
                    this.saveData();
                    this.renderMemos();
                }
            };
        });
    }
};

export function initTemplatePanel() {
    window.QA_CORE.Template.Manager.init();
}
