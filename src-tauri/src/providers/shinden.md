Search result page:

```html
<section .title-table>
	<header>
		...
	<article>
		<ul .div-row>
			<li .cover-col>
				<a href="cover-link">
			<li .desc-col>
				<h3>
					<a href="link">
						"Title"
				<ul .tags>
					<li>
						<a data-tag-id="a{id}" href="/genre/{id}-{name}">
							"Tag"
			<li .title-kind-col>
				"Kind"
			<li .episodes-col title="{num} x {duration}">
				"{num} "
			<li .ratings-col>
				<div .rating .rating-total data-type="total">
					<span>
						<em>
							"Ogólna: "
						"Score"
				<div .rating .rating-story data-type="story">
					...
				<div .rating .rating-graphics data-type="graphics">
					...
				<div .rating .rating-music data-type="music">
					...
				<!-- Notice the typo -->
				<div .rating .rating-titlecahracters data-type="titlecahracters">
					...
			<li .title-status-col>
				"Status"
			<li .rate-top title="Ocena TOP">
				"Score"
		<ul .highlight-row .row>
			<li .score title="Procent dopasowania" />
			<li .highlights .desc-col>
				<h4>
					"Opis angielski"
				<ul>
					<li>
						"[..] Description line... [..]"
				<h4>
					"Recenzja polska"
				<ul>
					<li>
						"[..] line [..]"
				<h4>
					"Tytuł"
				<ul>
					<li>
						"Title alt"
				<h4>
					"Opis polski"
				<ul>
					<li>
						"[..] Description line... [..]"
		...next entry
```

Episodes page:

```html
<section .episode-list>
	<>
		<table .data-view-table-episodes>
			<tbody .list-episode-checkboxes>
				<tr data-episode-no="{ep}">
					<td>
						"{ep}"
					<td .ep-title>
						"Tytuł"
					<td>
					<td>
						<span .flag-icon .flag-icon-{lang} title="{lang-name}">
					<td ep-date>
						"Data"
					<td .button-group>
						<a href="{link}">
				...next entry
```

Episode details page:

```html
<section .episode-player-list>
	<>
		<table>
			<thead>
				<tr>
					<th .ep-pl-name>
						"Serwis:"
					<th .ep-pl-res>
						"Jakość:"
					<th .ep-pl-alang>
						<:fa-icon headphones>
						<span>
							"Dźwięk"
					<th .ep-pl-slang>
						<:fa-icon bars>
						<span>
							"Napisy"
					<th .ep-online-added>
						"Dodano:"
					<th .ep-buttons>
						"Oglądaj: "
						<a href="/episode/{anime-id-display}/add_video/{episode-id}">
							<:icon plus>
							<span>
								"Dodaj nowy"
			<tbody>
				<tr>
					<td .ep-pl-name>
						"{Player name} "
					<td .ep-pl-res>
						<span title="{source-short}">
						"{resolution}"
					<td .ep-pl-alang>
						<span .flag-icon .flag-icon.{alang-lc}>
						<span>
							"{Alang display}"
					<td .ep-pl-slang>
						<span .flag-icon .flag-icon.{slang-lc}>
						<span>
							"{Slang display}"
					<td .ep-online-added>
						"{added-date}"
					<td .ep-buttons>
						<a #player_data_{player-id} .change-video-player data-episode="{episode-json}">
							<:fa-icon youtube-play>
							" Pokaż"
						<form action="/episode/{anime-id-display}/report-player/{player-id}">
							<!-- Report button -->
				...next entry
```

### `episode-json`
```json
{
	"online_id": "{player-id}",
	"player": "{Player name}",
	"username": "", // Always empty?
	"user_id": "{user-id}", // Seems to be 1 in a lot of cases
	"lang_audio": "{alang-lc}", // Stands for language code
	"lang_subs": "{slang-lc}",
	"max_res": "{resolution}",
	"subs_author": null | "Subtitle author",
	"added": "{added-date}",
	"source": null | "link with escaped \/",
}
```

### `added-date` format
`%04Y-%02M-%02D %02H:%02M:%02S`
