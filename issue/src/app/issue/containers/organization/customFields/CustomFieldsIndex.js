import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const CustomFieldsList = asyncRouter(() => import('./customFieldsList'), () => import('../../../stores/organization/customFields'));
const CustomFieldsEdit = asyncRouter(() => import('./customFieldsEdit'), () => import('../../../stores/organization/customFields'));
const AssociateFieldToScreens = asyncRouter(() => import('./associateFieldToScreens'), () => import('../../../stores/organization/customFields'));

const CustomFieldsIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={CustomFieldsList} />
    <Route exact path={`${match.url}/edit/:id`} component={CustomFieldsEdit} />
    <Route exact path={`${match.url}/associate/:id`} component={AssociateFieldToScreens} />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default CustomFieldsIndex;
