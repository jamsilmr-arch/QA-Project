// 북마크 패널 마크업 명세
export const BOOKMARK_TEMPLATE = `
    <div class="bookmark-container" style="width: 100%; display: flex; gap: 20px;">
        <div class="bookmark-sidebar" style="width: 280px; display: flex; flex-direction: column; gap: 15px;">
            <div class="card-panel layout-vertical">
                <h3 style="font-size: 0.95rem; font-weight: bold; margin-bottom: 8px;">새 북마크 등록</h3>
                <div class="form-group">
                    <label for="bm-title">사이트명</label>
                    <input type="text" id="bm-title" placeholder="예: 플레이 콘솔">
                </div>
                <div class="form-group">
                    <label for="bm-url">URL 주소</label>
                    <input type="text" id="bm-url" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label for="bm-folder-select">폴더 지정</label>
                    <select id="bm-folder-select"></select>
                </div>
                <button class="btn-action" id="add-bookmark-btn" style="background: var(--primary-color); color: white; width: 100%; margin-top: 5px;">북마크 추가</button>
            </div>
            
            <div class="card-panel layout-vertical">
                <h3 style="font-size: 0.95rem; font-weight: bold; margin-bottom: 8px;">폴더 관리 트리</h3>
                <div class="inline-group" style="display: flex; gap: 6px; margin-bottom: 10px;">
                    <input type="text" id="new-folder-input" placeholder="새 폴더명" style="padding: 6px 10px; font-size: 12px; flex: 1;">
                    <button id="create-folder-btn" class="btn-cal-nav" style="padding: 6px 10px; font-size: 12px; white-space: nowrap; background: var(--accent-blue); color: white; border: none;">+ 추가</button>
                </div>
                <div class="folder-list" id="bookmark-folder-zone" style="display: flex; flex-direction: column; gap: 2px;"></div>
            </div>
        </div>
        
        <div class="bookmark-content" style="flex: 1;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 520px;">
                <h3 style="font-size: 0.95rem; font-weight: bold; margin-bottom: 12px;" id="bookmark-binder-title">저장된 QA 링크 바인더</h3>
                <div class="link-list layout-vertical" id="bookmark-link-list-zone" style="gap: 10px;"></div>
            </div>
        </div>
    </div>
`;

window.QA_CORE = window.QA_CORE || {};

window.QA_CORE.Bookmark = {
    links: [],
    folders: [],
    currentFolder: 'all',
    
    init() {
        const bookmarkPanel = document.getElementById('tab-panel-bookmark');
        if (bookmarkPanel && !bookmarkPanel.innerHTML.trim()) {
            bookmarkPanel.innerHTML = BOOKMARK_TEMPLATE;
        }

        // [락 해제] 초기 구동 시 인스턴스 기동 방해막을 완전히 청소
        const linkListZone = document.getElementById('bookmark-link-list-zone');
        if (linkListZone) linkListZone.removeAttribute('data-bound');

        const localLinks = localStorage.getItem('QA_SYSTEM_BOOKMARKS');
        const localFolders = localStorage.getItem('QA_SYSTEM_BOOKBAR_FOLDERS_PURE');
        
        if (localLinks) {
            try { this.links = JSON.parse(localLinks); } catch (e) { this.links = []; }
        } else {
            this.links = [];
            this.saveLinks();
        }

        if (localFolders) {
            try { this.folders = JSON.parse(localFolders); } catch (e) { this.folders = []; }
        } else {
            this.folders = [];
            this.saveFolders();
        }

        this.bindEvents();
        this.refreshUI();
    },
    
    saveLinks() { localStorage.setItem('QA_SYSTEM_BOOKMARKS', JSON.stringify(this.links)); },
    saveFolders() { localStorage.setItem('QA_SYSTEM_BOOKBAR_FOLDERS_PURE', JSON.stringify(this.folders)); },
    
    addFolder(folderName) {
        if (!folderName) return;
        const trimmed = folderName.trim();
        if (this.folders.includes(trimmed) || trimmed === 'all') {
            if (window.QA_CORE.UI) window.QA_CORE.UI.showToast("이미 존재하는 폴더 명칭입니다.");
            return;
        }
        this.folders.push(trimmed);
        this.saveFolders();
        this.refreshUI();
    },
    
    deleteFolder(folderName) {
        if (!confirm(`'${folderName}' 폴더를 삭제하시겠습니까?\n해당 폴더 내 북마크 분류 지정이 해제됩니다.`)) return;
        
        this.links.forEach(item => {
            if (item.folder === folderName) item.folder = '';
        });
        
        this.folders = this.folders.filter(f => f !== folderName);
        if (this.currentFolder === folderName) this.currentFolder = 'all';
        
        this.saveFolders();
        this.saveLinks();
        this.refreshUI();
        if (window.QA_CORE.UI) window.QA_CORE.UI.showToast("폴더가 삭제되었습니다.");
    },
    
    addBookmark(title, url, folder) {
        if (!title || !url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        
        this.links.push({ 
            id: Date.now(), 
            title: title.trim(), 
            url: url.trim(), 
            folder: folder || ''
        });
        this.saveLinks();
        this.refreshUI();
    },
    
    deleteBookmark(id) {
        if (!confirm("선택한 북마크를 삭제하시겠습니까?")) return;
        // 완전 정수형 체계 일치 확인 가드 연산 적용
        this.links = this.links.filter(item => Number(item.id) !== Number(id));
        this.saveLinks();
        this.refreshUI();
    },
    
    setFolderFilter(folderName) {
        this.currentFolder = folderName;
        this.renderFolders();
        this.renderLinks();
    },
    
    refreshUI() {
        this.renderSelectOptions();
        this.renderFolders();
        this.renderLinks();
    },
    
    renderSelectOptions() {
        const selectBox = document.getElementById('bm-folder-select');
        if (!selectBox) return;
        selectBox.innerHTML = '';
        
        if (this.folders.length === 0) {
            const opt = document.createElement('option');
            opt.value = ''; opt.innerText = '지정 안 함 (전체 보기)';
            selectBox.appendChild(opt);
            return;
        }

        this.folders.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f; opt.innerText = f;
            selectBox.appendChild(opt);
        });
    },
    
    renderFolders() {
        const folderZone = document.getElementById('bookmark-folder-zone');
        if (!folderZone) return;
        folderZone.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.className = `folder-item ${this.currentFolder === 'all' ? 'active' : ''}`;
        allBtn.style.cssText = 'display:flex; justify-content:space-between; align-items:center; width:100%; border:none; padding:10px 12px; font-size:13px; font-weight:600; border-radius:6px; background:none; cursor:pointer;';
        if (this.currentFolder === 'all') allBtn.style.background = '#eef2f7';
        allBtn.innerHTML = `<span>📂 전체 보기</span> <span style="font-size:11px; background:rgba(0,0,0,0.05); padding:2px 6px; border-radius:10px;">${this.links.length}</span>`;
        allBtn.onclick = () => this.setFolderFilter('all');
        folderZone.appendChild(allBtn);

        const folderCounts = {};
        this.links.forEach(item => {
            if (item.folder) {
                folderCounts[item.folder] = (folderCounts[item.folder] || 0) + 1;
            }
        });

        this.folders.forEach(fName => {
            const count = folderCounts[fName] || 0;
            const fWrapper = document.createElement('div');
            fWrapper.className = `folder-item ${this.currentFolder === fName ? 'active' : ''}`;
            fWrapper.style.cssText = 'display:flex; justify-content:space-between; align-items:center; width:100%; padding:6px 8px 6px 12px; border-radius:6px; cursor:pointer; transition:background 0.2s;';
            if (this.currentFolder === fName) fWrapper.style.background = '#eef2f7';
            
            fWrapper.innerHTML = `
                <div style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; flex:1;">
                    <span>📁 ${fName}</span>
                    <span style="font-size:10px; color:var(--text-light);">(${count})</span>
                </div>
                <div class="folder-action-zone">
                    <button class="del-folder-btn" data-folder="${fName}" style="background:none; border:none; color:#ff3b30; cursor:pointer; font-size:11px; padding:2px 4px;">❌</button>
                </div>
            `;
            
            fWrapper.onclick = (e) => {
                if (e.target.classList.contains('del-folder-btn')) return;
                this.setFolderFilter(fName);
            };
            folderZone.appendChild(fWrapper);
        });
    },
    
    renderLinks() {
        const listZone = document.getElementById('bookmark-link-list-zone');
        const titleZone = document.getElementById('bookmark-binder-title');
        if (!listZone) return;
        listZone.innerHTML = '';

        if (titleZone) {
            titleZone.innerText = this.currentFolder === 'all' ? '저장된 QA 링크 바인더 (전체)' : `저장된 QA 링크 바인더 (${this.currentFolder})`;
        }

        const filteredLinks = this.links.filter(item => this.currentFolder === 'all' || item.folder === this.currentFolder);

        if (filteredLinks.length === 0) {
            listZone.innerHTML = '<div style="font-size:13px; color:var(--text-light); text-align:center; padding:40px 0;">이 구역에 등록된 북마크가 없습니다.</div>';
            return;
        }

        filteredLinks.forEach(item => {
            const card = document.createElement('div');
            card.className = 'link-card';
            
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', item.id);
            card.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:15px; border:1px solid var(--border-color); border-radius:8px; background:#fff; cursor:grab; transition:all 0.15s ease;';
            
            card.innerHTML = `
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:#a0aec0; cursor:grab; margin-right:4px; user-select:none;">☰</span>
                        <span style="font-weight: bold; color:var(--text-main); font-size:14px;">${item.title}</span>
                        ${item.folder ? `<span style="font-size:10px; padding:2px 6px; background:#eef2f7; color:var(--primary-color); border-radius:4px; font-weight:bold;">${item.folder}</span>` : ''}
                    </div>
                    <div style="font-size: 11px; color: var(--text-light); margin-top:4px;">${item.url}</div>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <a href="${item.url}" target="_blank" class="btn-cal-nav" style="text-decoration:none; display:inline-block; padding:4px 8px; font-size:12px;">🔗 이동</a>
                    <button class="del-bookmark-btn" data-id="${item.id}" style="cursor:pointer; padding:4px 8px; font-size:12px; border:1px solid #ff3b30; color:#ff3b30; background:none; border-radius:4px; position:relative; z-index:10;">❌</button>
                </div>
            `;
            listZone.appendChild(card);
        });

        this.bindDragAndDropEvents(listZone);
    },

    bindDragAndDropEvents(container) {
        let dragSrcEl = null;
        const cards = container.querySelectorAll('.link-card');

        cards.forEach(card => {
            card.addEventListener('dragstart', function(e) {
                // 삭제 버튼 스코프 안에서의 예외 드래그 기동 완전 격리 차단
                if (e.target.closest('.del-bookmark-btn')) {
                    e.preventDefault();
                    return false;
                }
                dragSrcEl = this;
                this.style.opacity = '0.5';
                this.style.background = '#f7fafc';
                e.dataTransfer.effectAllowed = 'move';
            });

            card.addEventListener('dragend', function() {
                this.style.opacity = '1.0';
                this.style.background = '#fff';
                cards.forEach(el => el.style.borderTop = '1px solid var(--border-color)'); 
            });

            card.addEventListener('dragover', function(e) {
                if (e.preventDefault) e.preventDefault();
                return false;
            });

            card.addEventListener('dragenter', function() {
                if (this !== dragSrcEl) {
                    this.style.borderTop = '3px dashed var(--primary-color)'; 
                }
            });

            card.addEventListener('dragleave', function() {
                if (this !== dragSrcEl) {
                    this.style.borderTop = '1px solid var(--border-color)';
                }
            });

            card.addEventListener('drop', (e) => {
                if (e.stopPropagation) e.stopPropagation();
                
                const targetEl = e.currentTarget;
                if (dragSrcEl !== targetEl) {
                    const fromId = parseInt(dragSrcEl.getAttribute('data-id'), 10);
                    const toId = parseInt(targetEl.getAttribute('data-id'), 10);
                    
                    this.reorderBookmarksData(fromId, toId);
                }
                return false;
            });
        });
    },

    reorderBookmarksData(fromId, toId) {
        const fromIndex = this.links.findIndex(item => item.id === fromId);
        const toIndex = this.links.findIndex(item => item.id === toId);
        
        if (fromIndex !== -1 && toIndex !== -1) {
            const targetItem = this.links.splice(fromIndex, 1)[0];
            this.links.splice(toIndex, 0, targetItem);
            
            this.saveLinks();
            
            // [정정] 재정렬 후 리스너 락을 깨끗이 비운 채 리프레시 진행
            const linkListZone = document.getElementById('bookmark-link-list-zone');
            if (linkListZone) linkListZone.removeAttribute('data-bound');
            
            this.refreshUI(); 
        }
    },

    bindEvents() {
        const addBmBtn = document.getElementById('add-bookmark-btn');
        if (addBmBtn && !addBmBtn.dataset.bound) {
            addBmBtn.addEventListener('click', () => {
                const titleInput = document.getElementById('bm-title');
                const urlInput = document.getElementById('bm-url');
                const folderSelect = document.getElementById('bm-folder-select');
                if (titleInput && urlInput && folderSelect) {
                    this.addBookmark(titleInput.value.trim(), urlInput.value.trim(), folderSelect.value);
                    titleInput.value = ''; urlInput.value = '';
                }
            });
            addBmBtn.dataset.bound = "true";
        }

        const createFolderBtn = document.getElementById('create-folder-btn');
        if (createFolderBtn && !createFolderBtn.dataset.bound) {
            createFolderBtn.addEventListener('click', () => {
                const folderInput = document.getElementById('new-folder-input');
                if (folderInput && folderInput.value.trim()) {
                    this.addFolder(folderInput.value.trim());
                    folderInput.value = '';
                }
            });
            createFolderBtn.dataset.bound = "true";
        }

        const folderZone = document.getElementById('bookmark-folder-zone');
        if (folderZone && !folderZone.dataset.bound) {
            folderZone.addEventListener('click', (e) => {
                const delBtn = e.target.closest('.del-folder-btn');
                if (delBtn) {
                    e.stopPropagation();
                    const targetFolder = delBtn.getAttribute('data-folder');
                    this.deleteFolder(targetFolder);
                }
            });
            folderZone.dataset.bound = "true";
        }

        const linkListZone = document.getElementById('bookmark-link-list-zone');
        if (linkListZone && !linkListZone.dataset.bound) {
            linkListZone.addEventListener('click', (e) => {
                const delBtn = e.target.closest('.del-bookmark-btn');
                if (delBtn) {
                    e.stopPropagation(); 
                    e.preventDefault();
                    
                    const id = parseInt(delBtn.getAttribute('data-id'), 10);
                    if (!isNaN(id)) {
                        this.deleteBookmark(id);
                    }
                }
            });
            linkListZone.dataset.bound = "true";
        }
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('BookmarkModule', window.QA_CORE.Bookmark);
}