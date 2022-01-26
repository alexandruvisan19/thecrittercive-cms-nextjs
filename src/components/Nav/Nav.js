import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

import useSite from 'hooks/use-site';
import useSearch, { SEARCH_STATE_LOADED } from 'hooks/use-search';
import { postPathBySlug } from 'lib/posts';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';
import { slide as Menu } from 'react-burger-menu';
import { useWindowSize } from '../../hooks/use-window-size';
import Logo from '../Svg/Logo';

import Section from 'components/Section';

import styles from './Nav.module.scss';
import NavListItem from 'components/NavListItem';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav = ({ procentScroll }) => {
  const formRef = useRef();
  const size = useWindowSize();

  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);

  const {
    // metadata = {},
    menus,
    // categories = [],
  } = useSite();
  // const { title } = metadata;

  // const hasRecentCategories = Array.isArray(categories) && categories.length > 0;

  const navigation = findMenuByLocation(menus, [
    process.env.WORDPRESS_MENU_LOCATION_NAVIGATION,
    MENU_LOCATION_NAVIGATION_DEFAULT,
  ]);

  const { query, results, search, clearSearch, state } = useSearch({
    maxResults: 5,
  });

  const searchIsLoaded = state === SEARCH_STATE_LOADED;

  // When the search visibility changes, we want to add an event listener that allows us to
  // detect when someone clicks outside of the search box, allowing us to close the results
  // when focus is drawn away from search

  useEffect(() => {
    // If we don't have a query, don't need to bother adding an event listener
    // but run the cleanup in case the previous state instance exists

    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    // When the search box opens up, additionall find the search input and focus
    // on the element so someone can start typing right away

    const searchInput = Array.from(formRef.current.elements).find((input) => input.type === 'search');

    searchInput.focus();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVisibility]);

  /**
   * addDocumentOnClick
   */

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * removeDocumentOnClick
   */

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  /**
   * handleOnDocumentClick
   */

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  /**
   * handleOnSearch
   */

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  /**
   * handleOnToggleSearch
   */

  function handleOnToggleSearch() {
    setSearchVisibility(SEARCH_VISIBLE);
  }

  /**
   * addResultsRoving
   */

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  /**
   * removeResultsRoving
   */

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  /**
   * handleResultsRoving
   */

  function handleResultsRoving(e) {
    const focusElement = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement.nodeName === 'INPUT' && focusElement.nextSibling.children[0].nodeName !== 'P') {
        focusElement.nextSibling.children[0].firstChild.firstChild.focus();
      } else if (focusElement.parentElement.nextSibling) {
        focusElement.parentElement.nextSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.firstChild.firstChild.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement.nodeName === 'A' && focusElement.parentElement.previousSibling) {
        focusElement.parentElement.previousSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.lastChild.firstChild.focus();
      }
    }
  }

  /**
   * escFunction
   */

  // pressing esc while search is focused will close it

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      clearSearch();
      setSearchVisibility(SEARCH_HIDDEN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {size.width <= 980 && (
        <Menu itemListElement="div" className={styles.burgerMenu} disableAutoFocus right>
          <Link href="/">
            <a aria-label="Logo">
              <Logo />
            </a>
          </Link>
          <div
            className={searchVisibility === SEARCH_HIDDEN ? `${styles.navSearchHidden}` : `${styles.navSearchVisible}`}
          >
            <form ref={formRef} action="/search" data-search-is-active={!!query}>
              <input
                type="search"
                name="q"
                value={query || ''}
                onChange={handleOnSearch}
                autoComplete="off"
                placeholder="What are you looking for?"
                required
              />
              <div className={styles.navSearchResults}>
                {results.length > 0 && (
                  <ul>
                    {results.map(({ slug, title }, index) => {
                      return (
                        <li key={slug}>
                          <Link tabIndex={index} href={postPathBySlug(slug)}>
                            <a>{title}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {results.length === 0 && (
                  <p>
                    Sorry, not finding anything for <strong>{query}</strong>
                  </p>
                )}
              </div>
            </form>
          </div>
          <ul id="page-wrap" className={styles.navMenu}>
            <li key="cat">
              <Link href="/categories/">
                <a>Categories</a>
              </Link>
            </li>
            {navigation?.map((listItem) => {
              return <NavListItem key={listItem.id} className={styles.navSubMenu} item={listItem} />;
            })}
          </ul>
        </Menu>
      )}
      <nav className={styles.nav}>
        <Section className={styles.navSection}>
          <p className={styles.navName}>
            <Link href="/">
              <a aria-label="Logo">
                <Logo />
              </a>
            </Link>
          </p>
          {size.width > 980 && (
            <ul id="page-wrap" className={styles.navMenu}>
              <li key="cat">
                <Link href="/categories/">
                  <a>
                    <strong>Categories</strong>
                  </a>
                </Link>
              </li>
              <li
                className={
                  searchVisibility === SEARCH_HIDDEN ? `${styles.navSearchHidden}` : `${styles.navSearchVisible}`
                }
              >
                {searchVisibility === SEARCH_HIDDEN && (
                  <button onClick={handleOnToggleSearch} disabled={!searchIsLoaded}>
                    <span className="sr-only">Toggle Search</span>
                    <FaSearch />
                  </button>
                )}
                {searchVisibility === SEARCH_VISIBLE && (
                  <form ref={formRef} action="/search" data-search-is-active={!!query}>
                    <input
                      type="search"
                      name="q"
                      value={query || ''}
                      onChange={handleOnSearch}
                      autoComplete="off"
                      placeholder="What are you looking for?"
                      required
                    />
                    <div className={styles.navSearchResults}>
                      {results.length > 0 && (
                        <ul>
                          {results.map(({ slug, title }, index) => {
                            return (
                              <li key={slug}>
                                <Link tabIndex={index} href={postPathBySlug(slug)}>
                                  <a>{title}</a>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {results.length === 0 && (
                        <p>
                          Sorry, not finding anything for <strong>{query}</strong>
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </li>
            </ul>
          )}
        </Section>
        {procentScroll && (
          <div className={styles.progressMainWrapper}>
            <div className={styles.progressMainStyle} style={{ width: `${procentScroll.value}%` }}></div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Nav;
