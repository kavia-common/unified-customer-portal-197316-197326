#!/bin/bash
cd /home/kavia/workspace/code-generation/unified-customer-portal-197316-197326/customer_portal_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

