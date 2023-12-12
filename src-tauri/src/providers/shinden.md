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
