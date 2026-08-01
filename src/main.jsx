import React from 'react';
import { createRoot } from 'react-dom/client';

// 字体改为本地 node_modules 编译（替代原 Google Fonts 在线请求）
// Roboto: 300/400/500/700
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Roboto Mono: 400/500/700
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
// 注：Google Sans 为 Google 专有字体，npm 无合法包；
// 保留在 font-family 栈中，缺失时自动降级到 Roboto。

import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
