(function () {
  // 画像URL一覧
  const imagesList = [
    'images/photo-1.jpg',
    'images/photo-2.jpg',
    'images/photo-3.jpg',
    'images/photo-4.jpg',
    'images/photo-5.jpg',
    'images/photo-6.jpg',
    'images/photo-7.jpg',
    'images/photo-8.jpg',
    'images/photo-9.jpg',
    'images/photo-10.jpg'
  ];

  const gallery = document.querySelector('.js-gallery');
  const progressbar = document.querySelector('.js-progressbar');

  // スクロール固定用
  const rootElement = document.documentElement;
  const scrollbarFixTargets = document.querySelectorAll('.js-scrollbarFix');
  let scrollbarFix = false;

  // 画像の枚数
  const count = imagesList.length;

  // 完了した数を管理する変数
  let current = 0;

  // DocumentFragmentはDOMツリー上にはなく、メモリ上だけに存在する
  // 子要素を追加しても描画のための計算が行われない = 実際にappendされるまでの処理が軽い
  const fragment = document.createDocumentFragment();

  // 完了した数をインクリメントする
  function updateCount() {
    current = current + 1;
    // `aria-valuenow`を更新する
    progressbar.setAttribute('aria-valuenow', current);

    if (current === count) {
      // DocumentFragmentをDOMツリーに追加する
      gallery.appendChild(fragment);
      // ローディング画面を非表示に
      hideProgressbar();
    }
  }

  // ギャラリーアイテムのHTMLを作成し、DocumentFragmentに追加
  function appendImageItem(url) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    div.classList.add('Gallery-item');
    img.classList.add('Gallery-image');
    img.setAttribute('src', url);
    div.appendChild(img);
    fragment.appendChild(div);
  }

  // 画像を1枚ロードする
  function loadImage(url) {
    const img = new Image();
    img.onload = function () {
      appendImageItem(this.src);
      updateCount();
    };
    img.src = url;
  }

  // 全ての画像をロードする
  function loadAllImages() {
    imagesList.forEach(function (url) {
      loadImage(url);
    })
  }

  // `aria-valuemax`の初期化
  function initProgressbar() {
    progressbar.setAttribute('aria-valuemax', count);
  }

  // ローディング画面をDOMから削除する
  function removeProgressbar() {
    const parent = progressbar.parentElement;
    parent.removeChild(progressbar);
  }

  // ローディング画面を非表示に
  function hideProgressbar() {
    progressbar.addEventListener('transitionend', onTransitionendProgressbar, false);
    progressbar.classList.add('hide');
  }

  // ローディング画面の非表示アニメーション終了時のイベントハンドラ
  // `removeProgressbar()`を実行する
  function onTransitionendProgressbar(event) {
    if (event.propertyName !== 'visibility') {
      return;
    }
    progressbar.removeEventListener('transitionend', onTransitionendProgressbar, false);
    // タブキー制御解除
    deactivatePreventKeydownTabKey();
    // スクロール固定解除
    deactivateScrollLock()
    removeProgressbar();
  }

  // タブキーでの移動制限
  // キー押下時のイベントハンドラ
  // タブキーが押下されたら`preventDefault()`して標準動作を無効にする
  function onKeydownTabKey(event) {
    if (event.key !== 'Tab') {
      return;
    }
    event.preventDefault();
  }

  // キー押下時のイベントリスナを追加
  function activatePreventKeydownTabKey() {
    progressbar.addEventListener('keydown', onKeydownTabKey, false);
  }

  // キー押下時のイベントリスナを削除
  function deactivatePreventKeydownTabKey() {
    progressbar.removeEventListener('keydown', onKeydownTabKey, false);
  }

  // スクロール固定
  function onTouchMoveProgressbar(event) {
    if (event.targetTouches.length > 1) {
      return;
    }
    event.preventDefault();
  }

  function activateScrollLock() {
    addScrollbarWidth();
    rootElement.classList.add('scrollLock');
    progressbar.addEventListener('touchmove', onTouchMoveProgressbar, false);
  }

  function deactivateScrollLock() {
    removeScrollbarWidth();
    rootElement.classList.remove('scrollLock');
    progressbar.removeEventListener('touchmove', onTouchMoveProgressbar, false);
  }

  function addScrollbarMargin(value) {
    const targetsLength = scrollbarFixTargets.length;
    for (let i = 0; i < targetsLength; i++) {
      scrollbarFixTargets[i].style.marginRight = value;
    }
  }

  function addScrollbarWidth() {
    const scrollbarWidth = window.innerWidth - rootElement.clientWidth;
    if (!scrollbarWidth) {
      scrollbarFix = false;
      return;
    }
    const value = scrollbarWidth + 'px';
    addScrollbarMargin(value);
    scrollbarFix = true;
  }

  function removeScrollbarWidth() {
    if (!scrollbarFix) {
      return;
    }
    addScrollbarMargin('');
  }

  // 実行
  initProgressbar();
  // フォーカスを合わせる
  progressbar.focus();
  // タブキー制御
  activatePreventKeydownTabKey();
  // スクロール固定
  activateScrollLock();

  // 確認のため、setTimeoutで処理を遅らせた
  window.setTimeout(function() {
    loadAllImages();
  }, 5000);
})();