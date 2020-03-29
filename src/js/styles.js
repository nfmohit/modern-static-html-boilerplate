/**
 * Load styles
 *
 * Each imported styles will be chunked and thus
 * help with browser caching, thanks to Webpack
 * SplitChunks plugin
 *
 * @author Nahid Ferdous Mohit.
 * @since  1.0.0
 */

/*
 * Load SASS File(S)
 */

/* Bootstrap */

import 'bootstrap/scss/bootstrap.scss';

/* FontAwesome */

import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';

/* Local styles */

import '../sass/main.scss';
