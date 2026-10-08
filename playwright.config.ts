import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:240000,workers:1,use:{baseURL:'http://localhost:4321',headless:true},webServer:{command:'npm run preview -- --host 127.0.0.1',url:'http://localhost:4321',reuseExistingServer:!process.env.CI}});
