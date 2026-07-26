import './components/Navbar.js';
import './components/ContentView.js';
import './components/WorkCard.js';


import './components/InfoPageCard.js';
import './components/workpagecomponents/VideoPlayer.js';

import './components/workpagecomponents/TextBlock.js';
import './components/workpagecomponents/ProjectHeadings.js';
import './components/workpagecomponents/PopUpBlock.js';
import './components/workpagecomponents/StackBlock.js';
import './components/workpagecomponents/InfoCard.js';
import './components/workpagecomponents/ImageSlider.js';
import './components/EmailContact.js';
import './components/Footer.js';
import './components/workpagecomponents/BackButton.js';

const menuConfiguration = [
  { label: 'Work', id: 'view-work' },
  { label: 'Info', id: 'view-info' }
];
const navbar = document.querySelector('my-navbar');
navbar.menuItems = menuConfiguration;

let currentDetailPageOpen = false;
let currentDetailViewId = null; // Tracks which detail page is open
let currentViewId = 'view-work';
let navLock = false; // Prevent simultaneous navigation triggers

function updateGlobalBackButtonVisibility() {
  const globalBackBtn = document.getElementById('global-back-btn');
  const contentViewWork = document.getElementById('view-work');
  
  if (!globalBackBtn || !contentViewWork) return;
  
  const isOnViewWork = contentViewWork.style.display !== 'none' && !contentViewWork.classList.contains('hidden');
  
  if (isOnViewWork && currentDetailPageOpen) {
    globalBackBtn.classList.remove('hidden');
    globalBackBtn.classList.add('visible');
    // console.log('[MAIN] Global back button SHOWN');
  } else {
    globalBackBtn.classList.add('hidden');
    globalBackBtn.classList.remove('visible');
    // console.log('[MAIN] Global back button HIDDEN');
  }
}

function setDetailPageState(isOpen, targetViewId = null) {
  // console.log(`[MAIN] setDetailPageState(${isOpen}, ${targetViewId})`);
  currentDetailPageOpen = isOpen;
  
  // Store which detail page is open
  if (isOpen && targetViewId) {
    currentDetailViewId = targetViewId;
  } else if (!isOpen) {
    currentDetailViewId = null;
  }
  
  updateGlobalBackButtonVisibility();
}

function switchView(targetViewId) {
  // Early exit if already on target or navigation locked
  if (currentViewId === targetViewId || navLock) {
    // console.log(`[MAIN] Navigation skipped - already at ${targetViewId} or locked`);
    return;
  }
  
  navLock = true;
  // console.log(`[MAIN] Switching view from ${currentViewId} to ${targetViewId}`);
  
  const allViews = document.querySelectorAll('content-view');
  allViews.forEach(view => {
    if (view.id === targetViewId) {
      view.show();
      // console.log(`[MAIN] Shown: ${targetViewId}`);
    } else {
      view.hide();
      // console.log(`[MAIN] Hidden: ${view.id}`);
    }
  });
  
  // Store new current view FIRST
  const oldViewId = currentViewId;
  currentViewId = targetViewId;
  
  // Wait for next frame, then fire event so listeners are ready
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('tab-changed', {
        detail: { 
          fromView: oldViewId, 
          toView: targetViewId,
          detailViewId: currentDetailViewId // Include last open detail view
        }
      }));
      // console.log(`[MAIN] Dispatched tab-changed event: ${oldViewId} → ${targetViewId}`);
      
      // Update button visibility after view + event completed
      updateGlobalBackButtonVisibility();
      
      // Release navigation lock
      navLock = false;
    }, 10);
  });
}

navbar.addEventListener('tab-change', (e) => {
  // console.log(`[MAIN] Navbar tab-change received: ${e.detail.tabId}`);
  const chosenTab = menuConfiguration.find(item => item.id === e.detail.tabId);
  
  if (chosenTab) {
    history.pushState({ viewId: chosenTab.id }, '', chosenTab.path);
    switchView(chosenTab.id);
  }
});

window.addEventListener('popstate', (e) => {
  // console.log(`[MAIN] popstate received`);
  const currentPath = window.location.pathname;
  const matchedTab = menuConfiguration.find(item => item.path === currentPath) || menuConfiguration[0];
  
  // Only process if this path matches a known tab
  if (matchedTab) {
    currentViewId = matchedTab.id;
    switchView(matchedTab.id);
  } else {
    // console.warn('[MAIN] Unknown path in popstate:', currentPath);
  }
});

// Make functions available globally for viewproject.js to call
window.setDetailPageState = setDetailPageState;