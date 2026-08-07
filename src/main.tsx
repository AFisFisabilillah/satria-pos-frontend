import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import {ConfigProvider} from "antd";
import {themeTokens} from "./theme/token.ts";
import {BrowserRouter, Routes} from "react-router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ConfigProvider theme={{
          token:themeTokens
      }}>
          <BrowserRouter>
              <Routes>

              </Routes>
          </BrowserRouter>
      </ConfigProvider>
  </StrictMode>,
)
