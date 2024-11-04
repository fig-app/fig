// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
  #[cfg(any(
    target_os = "linux",
    target_os = "freebsd",
    target_os = "dragonfly",
    target_os = "openbsd",
    target_os = "netbsd"
  ))]
  std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      // Set the window size to monitor size at startup
      if let Some(monitor) = window.primary_monitor().unwrap() {
        let monitor_size = monitor.size();
        window.set_size(tauri::PhysicalSize {
          width: monitor_size.width,
          height: monitor_size.height,
        }).unwrap();
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
