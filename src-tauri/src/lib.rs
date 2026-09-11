// АРХИТЕКТУРА: Frontend НЕ использует invoke() для CRUD-операций.
// Все операции с БД выполняются напрямую через tauri-plugin-sql из JavaScript.
// Сервисы (taskService, projectService и др.) вызывают getDb() из src/shared/services/db.ts
// Этот файл — резерв для Future-п фич, требующих бизнес-логику на Rust.

use tauri::Manager;

// Вызывает: src/shared/services/db.ts (НЕ ИСПОЛЬЗУЕТСЯ, демо-команда)
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Возвращает путь к директории данных приложения (app_data_dir).
// Фронтенд использует этот путь для подключения к SQLite через tauri-plugin-sql.
#[tauri::command]
fn get_app_db_path(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_data_dir.join("todo.db");
    Ok(db_path.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_app_db_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
