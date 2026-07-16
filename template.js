/**
 * [자가 복구형 다중 양식 메모 보드 - Title 필드 및 Grid 확장 패치]
 * 카드별 타이틀을 부여하고, 화면 가로폭을 100% 점유하여 다단 배치되도록 UI/UX를 교정했습니다.
 */
window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Template = window.QA_CORE.Template || {};

window.QA_CORE.Template.Manager = {
    memos: [],

    init() {
        this.ensureDomExists();
        this.loadData();
        this.renderLayout();
        this.bindGlobalEvents();
    },

    // DOM 주입 방어 로직 유지
    ensureDomExists() {
        let panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                panelZone = document.createElement('div');
                panelZone.id = 'tab-panel-template';
                panelZone.className = 'content-panel active';
                mainContent.appendChild(panelZone);
            }
        }
    },

    // 레거시 호환성을 고려한 데이터 로드
    loadData() {
        const data = localStorage.getItem('QA_CORE_MEMO_TEMPLATES');
        if (data) {
            try { 
                const parsedData = JSON.parse(data);
                // 구버전(Title 없는 데이터) 방어 및 마이그레이션 매핑
                this.memos = parsedData.map(m => ({
                    id: m.id,
                    title: m.title || "",
                    content: m.content || ""
                }));
            } catch(e) { 
                this.memos = []; 
            }
        } 
        
        // 최초 접속 시 기본 샘플 세팅
        if (this.memos.length === 0) {
            this.memos = [{
                id: Date.now(),
                title: "기본 결함 리포트 양식",
                content: "[Environment]\n■ PoC : \n■ Device(OS Ver.) : \n■ App : \n■ Server : \n\n[Pre-Condition]\n1. \n\n[재현스텝]\n1. \n2. \n3. \n\n[실행결과-문제현상]\n1. \n\n[기대결과]\n1. "
            }];
        }
    },

    saveData() {
        localStorage.setItem('QA_CORE_MEMO_TEMPLATES', JSON.stringify(this.memos));
    },

    // 레이아웃 가로폭 100% 점유 교정
    renderLayout() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;

        panelZone.innerHTML = `
            <div style="width: 100%; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 600px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #cbd5e0; padding-bottom: 12px;">
                    <div>
                        <h2 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">📝 다중 양식 메모 보드</h2>
                        <p style="font-size: 12px; color: #64748b; margin: 0;">작성 내용은 키보드 입력 시 브라우저에 실시간 자동 저장됩니다.</p>
                    </div>
                    <button id="btn-add-memo" style="background:#0f172a; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        + 칸 추가
                    </button>
                </div>
                
                <!-- Grid 폭 강제 확장 및 상단 정렬 적용 -->
                <div id="memo-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; width: 100%; align-items: start;">
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
            card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03); width: 100%; box-sizing: border-box;";
            
            // 타이틀 입력 필드 추가 및 레이아웃 재배치
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <input type="text" class="memo-title-input" data-id="${memo.id}" value="${memo.title}" placeholder="양식 제목을 입력하세요" style="flex: 1; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px 8px; font-weight: 700; font-size: 13px; color: #1e293b; outline: none; box-sizing: border-box;">
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">
                        <button class="btn-copy-memo" data-id="${memo.id}" style="background: #e0f2fe; color: #0284c7; border: none; padding: 6px 10px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">복사</button>
                        <button class="btn-delete-memo" data-id="${memo.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 10px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">삭제</button>
                    </div>
                </div>
                <textarea class="memo-textarea" data-id="${memo.id}" style="width: 100%; height: 320px; resize: vertical; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; font-family: 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.5; color: #334155; outline: none; box-sizing: border-box; background: #f8fafc;" placeholder="여기에 양식을 입력하세요...">${memo.content}</textarea>
            `;
            container.appendChild(card);
        });
        
        this.bindDynamicEvents();
    },

    bindGlobalEvents() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;
        
        panelZone.onclick = (e) => {
            if (e.target.id === 'btn-add-memo') {
                this.memos.push({ id: Date.now(), title: "", content: "" });
                this.saveData();
                this.renderMemos();
            }
        };
    },

    bindDynamicEvents() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;

        // 1. 타이틀 실시간 오토 세이브
        const titleInputs = container.querySelectorAll('.memo-title-input');
        titleInputs.forEach(input => {
            input.oninput = (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo) {
                    memo.title = e.target.value;
                    this.saveData();
                }
            };
        });

        // 2. 내용 실시간 오토 세이브
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

        // 3. 복사 버튼 로직
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

        // 4. 삭제 버튼 로직
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
