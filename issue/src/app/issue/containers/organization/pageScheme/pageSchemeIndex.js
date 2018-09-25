import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const PageSchemeList = asyncRouter(() => import('./pageSchemeList'), () => import('../../../stores/organization/pageScheme'));
const PageSchemeEdit = asyncRouter(() => import('./pageSchemeEdit'), () => import('../../../stores/organization/pageScheme'));
const PageSchemeCreate = asyncRouter(() => import('./pageSchemeCreate'), () => import('../../../stores/organization/pageScheme'));

const pageSchemeIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={PageSchemeList} />
    <Route exact path={`${match.url}/create`} component={PageSchemeCreate} />
    <Route exact path={`${match.url}/edit/:id`} component={PageSchemeEdit} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default pageSchemeIndex;
