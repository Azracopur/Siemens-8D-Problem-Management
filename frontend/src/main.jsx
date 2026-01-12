import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';


import "@siemens/ix/dist/siemens-ix/siemens-ix.css"; 


import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-quartz.css'; 


import { defineCustomElements } from '@siemens/ix/loader';
import { addIcons } from "@siemens/ix-icons"; 
import * as allIcons from "@siemens/ix-icons/icons";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; 

addIcons(allIcons);
ModuleRegistry.registerModules([ AllCommunityModule ]);
defineCustomElements();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);