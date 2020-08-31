/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Text, Element, Stack, Select, Link } from '@codesandbox/components';
// import compareVersions from 'compare-versions';
import { HomeIcon, GitHubIcon, CSBIcon } from './icons';

const checkboxStyles = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',

  "input[type='checkbox']": {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 32,
    width: 32,
    appearance: 'none',
    cursor: 'pointer',
  },
  'input[type="checkbox"]:checked + label:after': {
    transform: 'scale(1)',
  },
  'input[type="checkbox"]:checked + label:before': {
    borderColor: 'transparent',
  },
  label: {
    display: 'flex',
    cursor: 'pointer',
    position: 'relative',

    ':after, :before': {
      pointerEvents: 'none',
      cursor: 'pointer',
    },
    ':before': {
      display: 'flex',
      content: "' '",
      height: 21,
      width: 21,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'grays.400',
      borderRadius: '50%',
      marginRight: 4,
      boxSizing: 'border-box',
    },
    ':after': {
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      content: "' '",
      height: 21,
      width: 21,
      backgroundImage: `url('data:image/svg+xml,%3Csvg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M11 22.2808C17.0751 22.2808 22 17.3559 22 11.2808C22 5.20563 17.0751 0.280762 11 0.280762C4.92487 0.280762 0 5.20563 0 11.2808C0 17.3559 4.92487 22.2808 11 22.2808ZM17 7.28076L10.4971 13.603L6.39416 9.6141L5 11.0481L10.4971 16.3925L18.3942 8.71475L17 7.28076Z" fill="%235BC266"/%3E%3C/svg%3E%0A')`,
      transform: 'scale(0)',
      borderRadius: '50%',
      transition: 'transform .3s ease',
    },
  },
});

export const Dependency = ({ dependency }) => {
  const {
    state: { workspace },
    actions,
  } = useOvermind();

  // const versions = v =>
  //   Object.keys(v).sort((a, b) => {
  //     try {
  //       return compareVersions(b, a);
  //     } catch (e) {
  //       return 0;
  //     }
  //   });

  const getTagName = (tags, version) =>
    Object.keys(tags).find(key => tags[key] === version);

  return (
    <Stack
      padding={4}
      gap={4}
      css={css({
        color: 'sideBar.foreground',
        border: 'none',
        cursor: 'pointer',
        background: 'transparent',
        width: '100%',
        outline: 'none',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'sideBar.border',

        ':hover, :focus': {
          backgroundColor: 'sideBar.border',
        },
      })}
    >
      <Element css={checkboxStyles}>
        <input
          type="checkbox"
          id={dependency.name}
          checked={workspace.selectedDependencies[dependency.objectID]}
          onChange={() => actions.workspace.setSelectedDependencies(dependency)}
        />
        <label htmlFor={dependency.name} />
      </Element>
      <Stack
        justify="space-between"
        onClick={() => actions.workspace.setSelectedDependencies(dependency)}
        css={css({
          flexGrow: 1,
        })}
      >
        <Element paddingRight={4}>
          <Text
            block
            size={4}
            weight="bold"
            css={css({
              wordBreak: 'break-all',
            })}
          >
            {dependency.name}
          </Text>
          <Text
            block
            size={3}
            variant="muted"
            marginTop={1}
            css={css({ wordBreak: 'break-all' })}
          >
            {dependency.description}
          </Text>

          <Stack align="center" gap={2} marginTop={2}>
            <img
              css={css({
                borderRadius: 'small',
                width: '6',
                height: '6',
              })}
              src={dependency.owner?.avatar}
              alt={dependency.owner?.name}
            />
            <Text size={3}>{dependency.owner?.name}</Text>
          </Stack>
        </Element>
        <Element css={{ flexShrink: 0, width: 208 }}>
          <Select
            onClick={e => e.stopPropagation()}
            onChange={e => {
              actions.workspace.handleVersionChange({
                dependency,
                version: e.target.value,
              });
            }}
          >
            {Object.keys(dependency.versions)
              .reverse()
              .map(v => {
                const tagName = getTagName(dependency.tags, v);
                return (
                  <option value={v} key={v}>
                    {v} {tagName && `- ${tagName}`}
                  </option>
                );
              })}
          </Select>
          <Stack justify="flex-end" marginTop={2} gap={4} align="center">
            <Element>
              {dependency.homepage ? (
                <Tooltip content="Homepage">
                  <a href={dependency.homepage}>
                    <HomeIcon />
                  </a>
                </Tooltip>
              ) : null}
              <Tooltip content="Examples">
                <Link href={`/examples/package/${dependency.name}`}>
                  <CSBIcon />
                </Link>
              </Tooltip>
              {dependency.githubRepo ? (
                <Tooltip content="GitHub Repo">
                  <a
                    href={`https://github.com/${dependency.githubRepo.user}/${dependency.githubRepo.project}`}
                  >
                    <GitHubIcon />
                  </a>
                </Tooltip>
              ) : null}
            </Element>
            <Stack gap={2}>
              <Text size={3} variant="muted">
                {dependency.humanDownloadsLast30Days.toUpperCase()}
              </Text>
              <Text
                title={dependency.license}
                size={3}
                variant="muted"
                css={css({
                  maxWidth: 40,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                })}
              >
                {dependency.license}
              </Text>
            </Stack>
          </Stack>
        </Element>
      </Stack>
    </Stack>
  );
};