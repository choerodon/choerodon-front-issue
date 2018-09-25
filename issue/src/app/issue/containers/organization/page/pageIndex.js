import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const PageList = asyncRouter(() => import('./pageList'), () => import('../../../stores/organization/page'));
const PageEdit = asyncRouter(() => import('./pageEdit'), () => import('../../../stores/organization/page'));
const PageCreate = asyncRouter(() => import('./pageCreate'), () => import('../../../stores/organization/page'));

const PageIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={PageList} />
    <Route exact path={`${match.url}/create`} component={PageCreate} />
    <Route exact path={`${match.url}/edit/:id`} component={PageEdit} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default PageIndex;
