import QueryBuilder from '../../builder/QueryBuilder';
import { Package } from '../package/package.model';
import { User } from '../user/user.model';
import { ISubscription } from './subscription.interface';
import { Subscription } from './subscription.model';

// create subscription schema
const createSubscriptionIntoDB = async (payload: ISubscription) => {
  // check if the package is exists
  const existingPackage = await Package.findById(payload.package);
  if (!existingPackage) {
    throw new Error('Package not found');
  }

  // push the package price to the subscription
  payload.amount = existingPackage.price;

  //! ---- todo: verify transaction data from apple api ----

  //   const response = await appleApi.getTransactionInfo(payload.transactionId);

  // Decode the signed JWS payload to get the transaction data
  //   const transactionData = await appleApi.decodeTransaction(
  //     response.signedTransactionInfo
  //   );

  //? ---- todo: after verify transaction data from apple api then save it into db and update the user subscription

  // create subscription
  const result = await Subscription.create(payload);

  // update the user subscription
  await User.findByIdAndUpdate(payload.user, {
    subscription: result._id,
  });

  return result;
};

// update subscription

// get all subscriptions
const getAllSubscriptions = async (query: Record<string, any>) => {
  const subscriptionQuery = new QueryBuilder(
    Subscription.find().populate([
      {
        path: 'user',
        select: 'name username email phone image',
      },
      {
        path: 'package',
        select: 'tag unit discount totalPrice',
      },
    ]),
    query
  )
    .paginate()
    .sort();

  const [subscriptions, pagination] = await Promise.all([
    subscriptionQuery.modelQuery.lean(),
    subscriptionQuery.getPaginationInfo(),
  ]);
  return { subscriptions, pagination };
};

// get subscription by id

export const SubscriptionServices = {
  createSubscriptionIntoDB,
  getAllSubscriptions,
};
