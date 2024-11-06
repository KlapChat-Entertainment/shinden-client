// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub(crate) mod utils;
pub(crate) mod serde_helper;
pub mod model;
pub mod providers;
pub(crate) mod api;

fn main() {
  tauri::Builder::default()
    .manage(api::ApiState::create_default())
    .invoke_handler(tauri::generate_handler![
      //api::create_api_backend,
      api::search_anime,
      api::get_anime_details,
      api::get_episode_player_list,
      api::get_player_embed,
      api::get_interned_strings,
      api::launch_ext_player,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
