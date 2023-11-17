import React from 'react';
import { createRoot } from 'react-dom/client';
import Issues from '@pages/issues/Issues';
import '@pages/newtab/index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/issues');

console.log(window.location.toString());

export async function init() {
  const appContainer = document.querySelector('body');
  const url = window.location.toString();
  let issues = [];
  const pump = apiCall => {
    const thereIsData = apiCall.response;
    const parsedData = JSON.parse(apiCall.response);
    const hasLength = parsedData?.length > 0;
    if(hasLength) {
      issues.push(...parsedData);
    }
    const link = apiCall.getResponseHeader('Link');
    console.log(link)
    const urlToUse = link?.match(/<(.*?)>/)?.[1];
    console.log(urlToUse);
   /* if (link?.match(/next/)?.[0] === 'next') {
      apiCall = new XMLHttpRequest();
      apiCall.open('GET',urlToUse);
      apiCall.send();
      apiCall.onload = () => {
        pump(apiCall);
      };
    }*/
  };
  if (appContainer && url.match(/issues/)?.[0] === 'issues') {
    const root = createRoot(appContainer);
    let apiCall = new XMLHttpRequest();
    apiCall.open('GET', 'https://api.github.com/repos/bcgov/invasivesbc/issues');
    apiCall.send();
    apiCall.onload = () => {
      pump(apiCall);
      root.render(<Issues data={issues} />);
    };
  } else {
    throw new Error("Can not find #body or i ain't got no body");
  }
}

init();
